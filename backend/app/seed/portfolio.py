import uuid
from datetime import datetime
from sqlmodel import Session, select
from app.models.portfolio import UseCase, UseCaseFinancialSnapshot
from app.models.value import PortfolioFinancialHistory

def seed_portfolio(session: Session, organization_id: uuid.UUID):
    print("Seeding Portfolio & Financial Data...")
    
    # 1. Seed Use Cases
    use_cases_data = [
        {"name": "Claims Automation AI", "business_unit": "Insurance Ops", "owner": "Sarah Chen", "priority_score": 85, "risk_score": 30, "value_score": 92},
        {"name": "Churn Prediction Model", "business_unit": "CX & Retention", "owner": "Marcus Reid", "priority_score": 78, "risk_score": 45, "value_score": 88},
        {"name": "Legal Review Assistant", "business_unit": "Legal & procurement", "owner": "Marcus Reid", "priority_score": 45, "risk_score": 85, "value_score": 40},
    ]
    
    for uc_data in use_cases_data:
        uc = session.exec(select(UseCase).where(
            UseCase.organization_id == organization_id, 
            UseCase.name == uc_data["name"]
        )).first()
        if not uc:
            uc = UseCase(
                organization_id=organization_id,
                **uc_data
            )
            session.add(uc)
    session.commit()

    # 2. Seed Portfolio Financial History
    history_data = [
        {"quarter": "Q1 2024", "year": 2024, "quarter_num": 1, "investment_m": 0.4, "realized_m": 0.9, "projected_m": 1.2},
        {"quarter": "Q2 2024", "year": 2024, "quarter_num": 2, "investment_m": 0.7, "realized_m": 1.8, "projected_m": 2.1},
        {"quarter": "Q3 2024", "year": 2024, "quarter_num": 3, "investment_m": 1.1, "realized_m": 3.0, "projected_m": 3.4},
        {"quarter": "Q4 2024", "year": 2024, "quarter_num": 4, "investment_m": 1.69, "realized_m": 4.2, "projected_m": 4.8},
    ]
    
    for h_data in history_data:
        hist = session.exec(select(PortfolioFinancialHistory).where(
            PortfolioFinancialHistory.organization_id == organization_id,
            PortfolioFinancialHistory.quarter == h_data["quarter"]
        )).first()
        if not hist:
            hist = PortfolioFinancialHistory(
                organization_id=organization_id,
                **h_data
            )
            session.add(hist)
    session.commit()
