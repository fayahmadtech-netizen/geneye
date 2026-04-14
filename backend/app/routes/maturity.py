from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import selectinload
from sqlmodel import Session, select
from app.database.session import get_session
from app.models.identity import User
from app.models.maturity import (
    MaturityDomain,
    MaturityDomainRead,
    MaturityAssessment,
    MaturityScore,
    MaturityCriteria,
    AssessmentCreate,
    MaturitySummary,
    DomainScore,
)
from app.routes.deps import get_current_user

router = APIRouter()


def _maturity_level_label(overall_score: float) -> str:
    if overall_score <= 0:
        return "Unassessed"
    if overall_score < 2:
        return "Ad-hoc"
    if overall_score < 3:
        return "Emerging"
    if overall_score < 4:
        return "Defined"
    if overall_score < 4.5:
        return "Managed"
    return "Optimized"

@router.get("/domains", response_model=List[MaturityDomainRead])
def get_assessment_structure(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns the hierarchy of domains and criteria for the user to fill out.
    """
    statement = select(MaturityDomain).options(selectinload(MaturityDomain.criteria))
    domains = session.exec(statement).all()
    return domains

@router.post("/assessments", response_model=MaturitySummary)
def submit_assessment(
    assessment_in: AssessmentCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Saves a new maturity assessment and calculates the summary results.
    """
    # 1. Create the base assessment record
    assessment = MaturityAssessment(
        organization_id=current_user.organization_id,
        title=assessment_in.title,
        conducted_by=current_user.id
    )
    session.add(assessment)
    session.commit()
    session.refresh(assessment)

    # 2. Bulk insert scores
    for score_data in assessment_in.scores:
        score_obj = MaturityScore(
            assessment_id=assessment.id,
            criteria_id=score_data.criteria_id,
            score=score_data.score,
            notes=score_data.notes
        )
        session.add(score_obj)
    
    session.commit()
    
    # 3. Return the calculated summary (refreshing to get linked scores if needed)
    return get_assessment_summary_logic(assessment.id, session)

@router.get("/summary", response_model=MaturitySummary)
def get_latest_summary(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieves the summary for the latest assessment for the current organization.
    """
    latest = session.exec(
        select(MaturityAssessment)
        .where(MaturityAssessment.organization_id == current_user.organization_id)
        .order_by(MaturityAssessment.created_at.desc())
    ).first()
    
    if not latest:
        domains = session.exec(select(MaturityDomain)).all()
        domain_scores = [
            DomainScore(domain_id=d.id, label=d.label, score=0.0) for d in domains
        ]
        return MaturitySummary(
            organization_id=current_user.organization_id,
            overall_score=0.0,
            level=_maturity_level_label(0.0),
            domain_scores=domain_scores,
            assessment_id=None,
        )

    return get_assessment_summary_logic(latest.id, session)


def get_assessment_summary_logic(assessment_id: Any, session: Session) -> MaturitySummary:
    """
    Core logic to calculate weighted domain scores and overall maturity.
    """
    statement = (
        select(MaturityAssessment)
        .where(MaturityAssessment.id == assessment_id)
        .options(
            selectinload(MaturityAssessment.scores).selectinload(MaturityScore.criteria)
        )
    )
    assessment = session.exec(statement).first()
    if not assessment:
        raise HTTPException(status_code=404, detail="Assessment not found")

    # Fetch all domains to ensure we return scores for everything
    domains = session.exec(select(MaturityDomain)).all()
    domain_scores: List[DomainScore] = []
    
    total_weighted_sum = 0.0
    total_weight = 0.0

    for domain in domains:
        # Get all scores for this domain in this assessment
        relevant_scores = [s for s in assessment.scores if s.criteria.domain_id == domain.id]
        
        if not relevant_scores:
            domain_scores.append(DomainScore(domain_id=domain.id, label=domain.label, score=0.0))
            continue
            
        d_weighted_sum = 0.0
        d_weight_sum = 0.0
        
        for s in relevant_scores:
            w = s.criteria.weight or 1.0
            d_weighted_sum += s.score * w
            d_weight_sum += w
            
        domain_avg = d_weighted_sum / d_weight_sum if d_weight_sum > 0 else 0.0
        domain_scores.append(DomainScore(domain_id=domain.id, label=domain.label, score=round(domain_avg, 2)))
        
        total_weighted_sum += d_weighted_sum
        total_weight += d_weight_sum

    overall_score = total_weighted_sum / total_weight if total_weight > 0 else 0.0
    overall_rounded = round(overall_score, 2)

    return MaturitySummary(
        organization_id=assessment.organization_id,
        overall_score=overall_rounded,
        level=_maturity_level_label(overall_rounded),
        domain_scores=domain_scores,
        assessment_id=assessment.id,
    )
