from sqlmodel import create_engine, Session, SQLModel
from app.config.settings import settings
from typing import Generator

# The connect_args={"check_same_thread": False} is only needed for SQLite.
# For PostgreSQL (psycopg2), we don't need it.
engine = create_engine(
    settings.DATABASE_URL, 
    echo=False,  # Set to True for SQL logging in dev
    pool_pre_ping=True
)

def get_session() -> Generator[Session, None, None]:
    with Session(engine) as session:
        yield session

def init_db():
    # This imports all models so they are registered on SQLModel.metadata
    from app import models
    SQLModel.metadata.create_all(engine)
    from app.database.migrate_readiness import migrate_ato_diagnostics, migrate_chat_sessions

    migrate_ato_diagnostics(engine)
    migrate_chat_sessions(engine)
