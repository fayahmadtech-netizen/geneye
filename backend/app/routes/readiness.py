from __future__ import annotations

import uuid
from datetime import datetime
from typing import Any, List, Optional

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, ConfigDict, Field
from sqlmodel import Session, select, desc

from app.database.session import get_session
from app.models.ato import AtoDiagnostic
from app.models.identity import User
from app.routes.deps import get_current_user

router = APIRouter()

# --- Config (same source of truth as docs/phase2-ato.md) ---

WIZARD_STEPS = [
    {"key": "intake", "label": "Executive Intake", "order": 0},
    {"key": "scoring", "label": "AI Maturity Scoring", "order": 1},
    {"key": "prioritization", "label": "Risk & Value Prioritization", "order": 2},
    {"key": "blueprint", "label": "OS Blueprint Draft", "order": 3},
    {"key": "review", "label": "Executive Review", "order": 4},
]

INDUSTRIES = [
    "Semiconductors",
    "Automotive",
    "Healthcare",
    "Financial Services",
    "Manufacturing",
    "Energy",
    "Telecom",
    "Retail",
    "Technology",
    "Other",
]

MATURITY_LEVELS = ["Ad-hoc", "Emerging", "Defined", "Managed", "Optimized"]

STAKEHOLDER_ROLES = [
    "CEO",
    "CIO",
    "CAIO",
    "CFO",
    "COO",
    "CTO",
    "CHRO",
    "BU Head",
    "VP Engineering",
    "VP Data",
]


# --- Schemas ---


class ReadinessConfigOut(BaseModel):
    steps: List[dict]
    industries: List[str]
    maturity_levels: List[str]
    stakeholder_roles: List[str]


class DiagnosticListItem(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    company_name: str
    industry: Optional[str]
    current_maturity: Optional[str]
    avg_score: Optional[float]
    current_step: int
    created_at: datetime
    updated_at: datetime


class DiagnosticFull(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: uuid.UUID
    organization_id: uuid.UUID
    created_by: Optional[uuid.UUID]
    company_name: str
    industry: Optional[str]
    num_bus: Optional[str]
    stakeholders: List[str]
    strategic_ai_goals: List[str]
    current_maturity: Optional[str]
    ai_org_structure: Optional[str]
    current_step: int
    scores: dict
    prioritization: dict
    blueprint: List[dict]
    timeline_label: Optional[str]
    timeline_months: Optional[int]
    avg_score: Optional[float]
    created_at: datetime
    updated_at: datetime


class DiagnosticCreate(BaseModel):
    company_name: str = ""


class DiagnosticPatch(BaseModel):
    company_name: Optional[str] = None
    industry: Optional[str] = None
    num_bus: Optional[str] = None
    stakeholders: Optional[List[str]] = None
    strategic_ai_goals: Optional[List[str]] = None
    current_maturity: Optional[str] = None
    ai_org_structure: Optional[str] = None
    current_step: Optional[int] = Field(default=None, ge=0, le=4)
    scores: Optional[dict] = None
    prioritization: Optional[dict] = None
    blueprint: Optional[List[dict]] = None
    timeline_label: Optional[str] = None
    timeline_months: Optional[int] = None
    avg_score: Optional[float] = None


def _to_full(d: AtoDiagnostic) -> DiagnosticFull:
    return DiagnosticFull.model_validate(d)


def _touch(d: AtoDiagnostic) -> None:
    d.updated_at = datetime.utcnow()


# --- Routes ---


@router.get("/config", response_model=ReadinessConfigOut)
def get_readiness_config(
    current_user: User = Depends(get_current_user),
) -> Any:
    """Dropdowns, stepper labels, and stakeholder role options."""
    return ReadinessConfigOut(
        steps=WIZARD_STEPS,
        industries=INDUSTRIES,
        maturity_levels=MATURITY_LEVELS,
        stakeholder_roles=STAKEHOLDER_ROLES,
    )


@router.get("/diagnostics", response_model=List[DiagnosticListItem])
def list_diagnostics(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    rows = session.exec(
        select(AtoDiagnostic)
        .where(AtoDiagnostic.organization_id == current_user.organization_id)
        .order_by(desc(AtoDiagnostic.updated_at))
    ).all()
    return [DiagnosticListItem.model_validate(r) for r in rows]


@router.post("/diagnostics", response_model=DiagnosticFull)
def create_diagnostic(
    body: DiagnosticCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    d = AtoDiagnostic(
        organization_id=current_user.organization_id,
        created_by=current_user.id,
        company_name=body.company_name or "",
        avg_score=0.0,
    )
    session.add(d)
    session.commit()
    session.refresh(d)
    return _to_full(d)


@router.get("/diagnostics/{diagnostic_id}", response_model=DiagnosticFull)
def get_diagnostic(
    diagnostic_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    d = session.get(AtoDiagnostic, diagnostic_id)
    if not d or d.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Diagnostic not found")
    return _to_full(d)


@router.patch("/diagnostics/{diagnostic_id}", response_model=DiagnosticFull)
def patch_diagnostic(
    diagnostic_id: uuid.UUID,
    body: DiagnosticPatch,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    d = session.get(AtoDiagnostic, diagnostic_id)
    if not d or d.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Diagnostic not found")

    data = body.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(d, key, value)
    _touch(d)
    session.add(d)
    session.commit()
    session.refresh(d)
    return _to_full(d)


@router.delete("/diagnostics/{diagnostic_id}")
def delete_diagnostic(
    diagnostic_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
) -> Any:
    d = session.get(AtoDiagnostic, diagnostic_id)
    if not d or d.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Diagnostic not found")
    session.delete(d)
    session.commit()
    return {"ok": True}
