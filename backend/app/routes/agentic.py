from typing import Any, List
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database.session import get_session
from app.models.identity import User
from app.models.agentic import (
    LlmModel, 
    LlmModelRead, 
    DigitalWorker, 
    DigitalWorkerRead, 
    AgentTool, 
    AgentToolRead
)
from app.routes.deps import get_current_user

router = APIRouter()

@router.get("/models", response_model=List[LlmModelRead])
def get_llm_registry(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns the organization's sanctioned LLM models (Gemini, GPT-5, etc.).
    """
    models = session.exec(select(LlmModel)).all()
    return models

@router.get("/workers", response_model=List[DigitalWorkerRead])
def get_worker_marketplace(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns the marketplace of available Digital Worker personas for the organization.
    """
    workers = session.exec(
        select(DigitalWorker).where(DigitalWorker.organization_id == current_user.organization_id)
    ).all()
    return workers

@router.get("/tools", response_model=List[AgentToolRead])
def get_agent_tools(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns the catalog of capabilities/tools available to autonomous agents.
    """
    tools = session.exec(
        select(AgentTool).where(AgentTool.organization_id == current_user.organization_id)
    ).all()
    return tools
