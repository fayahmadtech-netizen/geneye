from typing import Any, List, Dict
import uuid
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select, func
from app.database.session import get_session
from app.models.identity import User
from app.models.portfolio import (
    UseCase, 
    UseCaseRead, 
    UseCaseCreate, 
    PortfolioSummary
)
from app.routes.deps import get_current_user

router = APIRouter()

@router.get("/use-cases", response_model=List[UseCaseRead])
def get_use_cases(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    List all AI initiatives for the organization.
    """
    statement = select(UseCase).where(UseCase.organization_id == current_user.organization_id)
    use_cases = session.exec(statement).all()
    return use_cases

@router.post("/use-cases", response_model=UseCaseRead)
def create_use_case(
    use_case_in: UseCaseCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Register a new AI Use Case during the intake phase.
    """
    db_obj = UseCase(
        organization_id=current_user.organization_id,
        **use_case_in.dict()
    )
    session.add(db_obj)
    session.commit()
    session.refresh(db_obj)
    return db_obj

@router.get("/analytics/summary", response_model=PortfolioSummary)
def get_portfolio_analytics(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Calculates organization-wide ROI and prioritization quadrant data.
    """
    # 1. Fetch all use cases for the organization
    use_cases = session.exec(
        select(UseCase).where(UseCase.organization_id == current_user.organization_id)
    ).all()

    total_realized_k = 0.0
    total_projected_k = 0.0
    roi_sum = 0.0
    roi_count = 0
    
    quadrant_data = []

    for uc in use_cases:
        # Sum up individual financials (taking latest snapshot per use case)
        if uc.financial_snapshots:
            # Sort by date created desc or quarter? For simplicity, take the latest in relationship
            latest_snap = uc.financial_snapshots[-1]
            total_realized_k += latest_snap.realized_value_k
            total_projected_k += latest_snap.projected_value_k
            if latest_snap.roi_pct:
                roi_sum += latest_snap.roi_pct
                roi_count += 1
        
        # Prepare quadrant data (Risk vs Value)
        quadrant_data.append({
            "id": str(uc.id),
            "name": uc.name,
            "x": uc.risk_score,
            "y": uc.value_score,
            "status": uc.status
        })

    avg_roi = roi_sum / roi_count if roi_count > 0 else 0.0

    return PortfolioSummary(
        total_active_use_cases=len(use_cases),
        total_realized_value_k=round(total_realized_k, 2),
        total_projected_value_k=round(total_projected_k, 2),
        average_roi_pct=round(avg_roi, 2),
        quadrant_data=quadrant_data
    )

@router.get("/{use_case_id}", response_model=UseCaseRead)
def get_use_case_details(
    use_case_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Fetch deep details for a specific AI initiative.
    """
    use_case = session.get(UseCase, use_case_id)
    if not use_case or use_case.organization_id != current_user.organization_id:
        raise HTTPException(status_code=404, detail="Use case not found")
    return use_case
