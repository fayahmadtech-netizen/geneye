import uuid
from sqlmodel import Session, select
from app.models.maturity import MaturityDomain, MaturityCriteria
from app.models.strategy import BlueprintPrinciple

def seed_strategy(session: Session, organization_id: uuid.UUID):
    print("Seeding Strategy & Maturity Content...")
    
    # 1. Seed Maturity Domains & Criteria
    domains_data = [
        {"id": "strategy", "label": "Strategy", "description": "AI alignment with corporate goals"},
        {"id": "data", "label": "Data & Privacy", "description": "Data readiness and governance"},
        {"id": "technology", "label": "Technology & Architecture", "description": "Infrastructure and tooling"},
        {"id": "operations", "label": "Operations & Scale", "description": "MLOps and lifecycle management"},
        {"id": "people", "label": "People & Culture", "description": "Skills and organizational change"},
    ]
    
    for d_data in domains_data:
        domain = session.get(MaturityDomain, d_data["id"])
        if not domain:
            domain = MaturityDomain(**d_data)
            session.add(domain)
    session.commit()

    # Seed some sample criteria for Strategy domain
    criteria_data = [
        {"domain_id": "strategy", "label": "AI North Star", "description": "Clearly defined AI vision and goals"},
        {"domain_id": "strategy", "label": "Executive Support", "description": "Leadership buy-in and funding"},
        {"domain_id": "data", "label": "Data Quality", "description": "Reliability and accuracy of upstream data"},
    ]
    
    for c_data in criteria_data:
        criteria = session.exec(select(MaturityCriteria).where(MaturityCriteria.label == c_data["label"])).first()
        if not criteria:
            criteria = MaturityCriteria(**c_data)
            session.add(criteria)
    session.commit()

    # 2. Seed HI-FACTS Principles
    principles_data = [
        {"letter": "H", "label": "Human-Centric", "description": "AI must augment, not replace, human judgment."},
        {"letter": "I", "label": "Inclusive", "description": "AI systems must be designed for diverse user groups."},
        {"letter": "F", "label": "Fair", "description": "Proactive bias detection and mitigation."},
        {"letter": "A", "label": "Accountable", "description": "Clear ownership of AI outcomes."},
        {"letter": "C", "label": "Compliant", "description": "Adherence to global regulations (EU AI Act, etc.)."},
        {"letter": "T", "label": "Transparent", "description": "Explainability by design."},
        {"letter": "S", "label": "Secure", "description": "Robustness against adversarial attacks."},
    ]
    
    for i, p_data in enumerate(principles_data):
        principle = session.exec(select(BlueprintPrinciple).where(
            BlueprintPrinciple.organization_id == organization_id, 
            BlueprintPrinciple.letter == p_data["letter"]
        )).first()
        if not principle:
            principle = BlueprintPrinciple(
                organization_id=organization_id,
                order=i,
                **p_data
            )
            session.add(principle)
    session.commit()
