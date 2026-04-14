from typing import Any, List
import random
from datetime import datetime
from fastapi import APIRouter, Depends
from sqlmodel import Session, select
from app.database.session import get_session
from app.models.identity import User
from app.models.industrial import (
    FabSite, 
    FabSiteRead, 
    SiliconIpBlock, 
    IpBlockRead, 
    PhysicalAiOutcome, 
    PhysicalAiOutcomeRead,
    FabMetricDaily
)
from app.routes.deps import get_current_user

router = APIRouter()

@router.get("/sites", response_model=List[FabSiteRead])
def get_industrial_sites(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns global manufacturing sites with latest daily health metrics.
    """
    # Note: We are simulating "latest metrics" by refreshing the site data
    sites = session.exec(
        select(FabSite).where(FabSite.organization_id == current_user.organization_id)
    ).all()
    
    # Optional: Simulating live metrics if none exist (per Implementation Plan)
    for site in sites:
        if not site.metrics:
            # Add a temporary random metric for the UI
            site.metrics = [
                FabMetricDaily(
                    metric_type="yield", 
                    value=random.uniform(85.0, 98.0),
                    timestamp=datetime.utcnow()
                )
            ]
            
    return sites

@router.get("/ip-blocks", response_model=List[IpBlockRead])
def get_silicon_ip_catalog(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns the organization's library of Silicon IP blocks and their performance metrics.
    """
    blocks = session.exec(
        select(SiliconIpBlock).where(SiliconIpBlock.organization_id == current_user.organization_id)
    ).all()
    return blocks

@router.get("/outcomes", response_model=List[PhysicalAiOutcomeRead])
def get_transformation_outcomes(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns high-level results from Physical AI initiatives (e.g., Yield Improvement).
    """
    outcomes = session.exec(
        select(PhysicalAiOutcome).where(PhysicalAiOutcome.organization_id == current_user.organization_id)
    ).all()
    return outcomes
