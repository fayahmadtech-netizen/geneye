import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database.session import get_session
from app.models.identity import User
from app.models.engineering import (
    EngineeringSystem,
    EngineeringSystemRead,
    EngineeringSystemUpdate,
    AdlcPipelineRun,
    AdlcPipelineRunRead
)
from app.routes.deps import get_current_user

router = APIRouter()

@router.get("/systems", response_model=List[EngineeringSystemRead])
def get_engineering_systems(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns all ADLC engineering systems within the workspace.
    """
    statement = select(EngineeringSystem).where(EngineeringSystem.organization_id == current_user.organization_id)
    systems = session.exec(statement).all()
    return systems

@router.get("/systems/{system_id}", response_model=EngineeringSystemRead)
def get_engineering_system(
    system_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get a specific engineering system (for rendering the React Flow canvas).
    """
    system = session.get(EngineeringSystem, system_id)
    if not system or system.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="System not found")
        
    return system

@router.put("/systems/{system_id}", response_model=EngineeringSystemRead)
def update_engineering_system(
    system_id: uuid.UUID,
    system_in: EngineeringSystemUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Updates the engineering system (e.g., saving React Flow node positions and edges).
    """
    system = session.get(EngineeringSystem, system_id)
    if not system or system.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="System not found")
        
    update_data = system_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(system, field, value)
        
    session.add(system)
    session.commit()
    session.refresh(system)
    
    return system

@router.get("/systems/{system_id}/runs", response_model=List[AdlcPipelineRunRead])
def get_system_pipeline_runs(
    system_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieves the ADLC pipeline execution history for a system.
    """
    system = session.get(EngineeringSystem, system_id)
    if not system or system.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="System not found")
        
    statement = select(AdlcPipelineRun).where(AdlcPipelineRun.system_id == system_id)
    runs = session.exec(statement).all()
    return runs
