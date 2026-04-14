import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database.session import get_session
from app.models.identity import User
from app.models.governance import (
    ModelCard, 
    ModelCardRead,
    RiskTierDefinition,
    RiskInventoryRead,
    GovernanceAlert,
    GovernanceAlertRead,
    AiGuardrail,
    GuardrailRead
)
from app.routes.deps import get_current_user

router = APIRouter()

@router.get("/inventory", response_model=List[RiskInventoryRead])
def get_risk_inventory(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns the organization's risk tier definitions and compliance requirements.
    """
    statement = select(RiskTierDefinition)
    tiers = session.exec(statement).all()
    return tiers

@router.get("/model-cards/{model_id}", response_model=ModelCardRead)
def get_model_card(
    model_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieves the safety and governance documentation for a specific model.
    """
    statement = select(ModelCard).where(ModelCard.model_id == model_id)
    card = session.exec(statement).first()
    
    if not card:
        raise HTTPException(status_code=404, detail="Model card not found")
        
    return card

@router.get("/alerts", response_model=List[GovernanceAlertRead])
def get_governance_alerts(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns active compliance/governance alerts for the organization.
    """
    statement = select(GovernanceAlert).where(
        GovernanceAlert.organization_id == current_user.organization_id,
        GovernanceAlert.is_addressed == False
    )
    alerts = session.exec(statement).all()
    return alerts

@router.get("/guardrails", response_model=List[GuardrailRead])
def get_active_guardrails(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns the active safety filters and guardrails for the organization.
    """
    statement = select(AiGuardrail).where(AiGuardrail.organization_id == current_user.organization_id)
    guardrails = session.exec(statement).all()
    return guardrails
