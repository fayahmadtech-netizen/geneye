import uuid
from datetime import datetime
from sqlmodel import Session, select
from app.models.industrial import FabSite, SiliconIpBlock, IpBlockItem, IpBlockMetric
from app.models.value import StrategicObjective, AiHealthIndicator

def seed_operations(session: Session, organization_id: uuid.UUID, admin_user_id: uuid.UUID):
    print("Seeding Industrial & Value Operations...")
    
    # 1. Seed Strategic Objectives
    objectives_data = [
        {"objective": "Reduce Operational Costs by 20%", "ai_contribution": 68, "status": "On Track", "owner": "CFO Office"},
        {"objective": "Increase Revenue by $10M", "ai_contribution": 42, "status": "At Risk", "owner": "CEO Office"},
        {"objective": "Improve Customer NPS by 15pts", "ai_contribution": 55, "status": "On Track", "owner": "CCO Office"},
        {"objective": "Reduce Risk Exposure by 30%", "ai_contribution": 81, "status": "Ahead", "owner": "CRO Office"},
    ]
    
    for i, o_data in enumerate(objectives_data):
        obj = session.exec(select(StrategicObjective).where(
            StrategicObjective.organization_id == organization_id,
            StrategicObjective.objective == o_data["objective"]
        )).first()
        if not obj:
            obj = StrategicObjective(
                organization_id=organization_id,
                display_order=i,
                **o_data
            )
            session.add(obj)
    session.commit()

    # 2. Seed Fab Sites
    sites_data = [
        {"id": "dresden", "location_flag": "DE", "status": "active"},
        {"id": "malta", "location_flag": "MT", "status": "active"},
        {"id": "singapore", "location_flag": "SG", "status": "warning"},
    ]
    
    for s_data in sites_data:
        site = session.get(FabSite, s_data["id"])
        if not site:
            site = FabSite(
                organization_id=organization_id,
                manager_id=admin_user_id,
                **s_data
            )
            session.add(site)
    session.commit()

    # 3. Seed Silicon IP Blocks (Sample for b1)
    ip_blocks_data = [
        {"id": "b1", "title": "Secure AI Controller"},
        {"id": "b2", "title": "Compute IP Platform"},
        {"id": "b3", "title": "Edge TPU Config"},
    ]
    
    for b_data in ip_blocks_data:
        block = session.get(SiliconIpBlock, b_data["id"])
        if not block:
            block = SiliconIpBlock(
                organization_id=organization_id,
                **b_data
            )
            session.add(block)
            session.commit()
            
            # Simple child items for b1
            if b_data["id"] == "b1":
                items = ["Identity Management", "Secure Enclave", "Root of Trust"]
                for item in items:
                    session.add(IpBlockItem(block_id="b1", point=item))
                
                metrics = [
                    {"label": "Latency", "value": "< 5ms"},
                    {"label": "Power", "value": "1.2W"}
                ]
                for m_data in metrics:
                    session.add(IpBlockMetric(block_id="b1", **m_data))
    session.commit()
