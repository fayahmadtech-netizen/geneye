import uuid
from sqlmodel import Session, select
from app.models.agentic import LlmModel, DigitalWorker, AgentTool
from app.models.mlops import MlModel

def seed_agentic(session: Session, organization_id: uuid.UUID):
    print("Seeding Agentic & AI Capabilities...")
    
    # 1. Seed LLM Model Registry
    models_data = [
        {"id": "auto", "provider": "GenEye"},
        {"id": "google/gemini-3-flash-preview", "provider": "Google"},
        {"id": "google/gemini-2.5-pro", "provider": "Google"},
        {"id": "openai/gpt-5", "provider": "OpenAI"},
        {"id": "openai/gpt-5-mini", "provider": "OpenAI"},
    ]
    
    for m_data in models_data:
        # Check in LlmModel
        model = session.get(LlmModel, m_data["id"])
        if not model:
            session.add(LlmModel(**m_data))
        
        # Also check in MlModel (Portfolio use case models)
        ml_model = session.exec(select(MlModel).where(MlModel.name == m_data["id"])).first()
        if not ml_model:
            session.add(MlModel(
                organization_id=organization_id,
                name=m_data["id"],
                type="LLM",
                version="v1.0.0",
                status="Champion"
            ))
    session.commit()

    # 2. Seed Digital Worker Personas
    workers_data = [
        {"persona_id": "sre", "role_label": "Digital SRE", "efficiency_score": 94.2},
        {"persona_id": "architect", "role_label": "Digital System Architect", "efficiency_score": 88.5},
        {"persona_id": "risk", "role_label": "Compliance Agent", "efficiency_score": 91.0},
    ]
    
    for w_data in workers_data:
        worker = session.exec(select(DigitalWorker).where(
            DigitalWorker.organization_id == organization_id,
            DigitalWorker.persona_id == w_data["persona_id"]
        )).first()
        if not worker:
            worker = DigitalWorker(
                organization_id=organization_id,
                **w_data
            )
            session.add(worker)
    session.commit()

    # 3. Seed Agent Tools
    tools_data = [
        {"name": "Google Search", "description": "Web research capability"},
        {"name": "Python Interpreter", "description": "Sandboxed code execution"},
        {"name": "Supabase Query", "description": "Direct database interrogation"},
    ]
    
    for t_data in tools_data:
        tool = session.exec(select(AgentTool).where(
            AgentTool.organization_id == organization_id,
            AgentTool.name == t_data["name"]
        )).first()
        if not tool:
            tool = AgentTool(
                organization_id=organization_id,
                **t_data
            )
            session.add(tool)
    session.commit()
