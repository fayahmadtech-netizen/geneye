import uuid
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database.session import get_session
from app.models.identity import User
from app.models.mlops import (
    MlModel, 
    MlModelRead, 
    TrainingExperiment, 
    ExperimentRead
)
from app.routes.deps import get_current_user

router = APIRouter()

@router.get("/models", response_model=List[MlModelRead])
def get_ml_models(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns all registered ML models for the organization, including their basic metrics.
    """
    statement = select(MlModel).where(MlModel.organization_id == current_user.organization_id)
    models = session.exec(statement).all()
    return models

@router.get("/models/{model_id}/experiments", response_model=List[ExperimentRead])
def get_model_experiments(
    model_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get the training history (experiments) for a specific model.
    """
    # Verify model belongs to org
    model = session.get(MlModel, model_id)
    if not model or model.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Model not found")

    statement = select(TrainingExperiment).where(TrainingExperiment.model_id == model_id)
    experiments = session.exec(statement).all()
    return experiments

@router.get("/pipelines")
def get_pipeline_runs(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Get the status of ML pipelines (placeholder implementation).
    """
    # For now, just returning an empty list as we haven't created a read schema for pipelines yet,
    # and they aren't fully seeded. We can expand this later.
    from app.models.mlops import PipelineRun
    statement = select(PipelineRun).where(PipelineRun.organization_id == current_user.organization_id)
    runs = session.exec(statement).all()
    return {"runs": [run.model_dump(mode="json") for run in runs]}
