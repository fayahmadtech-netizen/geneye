"""
Align `ato_diagnostics` with the current SQLModel when the DB predates new columns.

Fixes: psycopg2.errors.UndefinedColumn (e.g. created_by does not exist)
"""

from __future__ import annotations

from sqlalchemy import inspect, text
from sqlalchemy.engine import Engine

DEFAULT_SCORES = (
    '{"governance": 0, "capital": 0, "org": 0, '
    '"portfolio": 0, "adoption": 0, "integration": 0}'
)


def _col_names(engine: Engine, table: str) -> set[str]:
    insp = inspect(engine)
    if table not in insp.get_table_names():
        return set()
    return {c["name"] for c in insp.get_columns(table)}


def _prioritization_is_string(engine: Engine, table: str) -> bool:
    insp = inspect(engine)
    for c in insp.get_columns(table):
        if c["name"] != "prioritization":
            continue
        tname = type(c["type"]).__name__.lower()
        return "varchar" in tname or "string" in tname or "text" in tname or "char" in tname
    return False


def migrate_ato_diagnostics(engine: Engine) -> None:
    table = "ato_diagnostics"
    insp = inspect(engine)
    if table not in insp.get_table_names():
        return

    dialect = engine.dialect.name

    def run(sql: str) -> None:
        with engine.begin() as conn:
            conn.execute(text(sql))

    names = _col_names(engine, table)

    # Legacy string prioritization column -> JSON
    if "prioritization" in names and _prioritization_is_string(engine, table):
        run(f"ALTER TABLE {table} RENAME COLUMN prioritization TO prioritization_legacy")
        names = _col_names(engine, table)

    adds: list[tuple[str, str]] = [
        ("created_by", "UUID"),
        ("industry", "TEXT"),
        ("num_bus", "TEXT"),
        ("current_maturity", "TEXT"),
        ("ai_org_structure", "TEXT"),
        ("current_step", "INTEGER DEFAULT 0"),
        ("timeline_label", "TEXT"),
        ("timeline_months", "INTEGER"),
    ]

    if dialect == "postgresql":
        json_arr = "JSONB DEFAULT '[]'::jsonb"
        json_obj = "JSONB DEFAULT '{}'::jsonb"
        ts = "TIMESTAMP"
        scores_col = f"JSONB DEFAULT '{DEFAULT_SCORES}'::jsonb"
        avg_col = "DOUBLE PRECISION"
    else:
        json_arr = "TEXT DEFAULT '[]'"
        json_obj = "TEXT DEFAULT '{}'"
        ts = "TEXT"
        scores_col = f"TEXT DEFAULT '{DEFAULT_SCORES}'"
        avg_col = "REAL"

    adds.extend(
        [
            ("stakeholders", json_arr),
            ("strategic_ai_goals", json_arr),
            ("blueprint", json_arr),
            ("prioritization", json_obj),
            ("scores", scores_col),
            ("created_at", ts),
            ("updated_at", ts),
            ("avg_score", avg_col),
        ]
    )

    for col_name, ddl in adds:
        names = _col_names(engine, table)
        if col_name in names:
            continue
        run(f"ALTER TABLE {table} ADD COLUMN {col_name} {ddl}")

    # Legacy rows: avg_score NOT NULL without default
    names_final = _col_names(engine, table)
    if "avg_score" in names_final and dialect == "postgresql":
        run(f"UPDATE {table} SET avg_score = 0 WHERE avg_score IS NULL")
        run(f"ALTER TABLE {table} ALTER COLUMN avg_score SET DEFAULT 0")

    # Renamed old VARCHAR prioritization -> prioritization_legacy may still be NOT NULL;
    # SQLModel does not map it, so new INSERTs leave it NULL.
    if "prioritization_legacy" in _col_names(engine, table) and dialect == "postgresql":
        run(f"ALTER TABLE {table} ALTER COLUMN prioritization_legacy DROP NOT NULL")

    # Old AtoDiagnostic had completed_at NOT NULL; current model only has created_at/updated_at.
    # recommendations (JSON) may also be NOT NULL on legacy DBs.
    names_legacy = _col_names(engine, table)
    if dialect == "postgresql":
        for col in ("completed_at", "recommendations"):
            if col in names_legacy:
                run(f"ALTER TABLE {table} ALTER COLUMN {col} DROP NOT NULL")
