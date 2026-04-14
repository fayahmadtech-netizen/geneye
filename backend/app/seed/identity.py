from sqlmodel import Session, select
from app.models.identity import Organization, Role, User, PlatformModule

def seed_identity(session: Session):
    print("Seeding Identity & Core...")
    
    # 1. Seed Organization
    org = session.exec(select(Organization).where(Organization.subdomain == "acme")).first()
    if not org:
        org = Organization(
            name="Acme Corporation",
            subdomain="acme",
            branding_config={"primary_color": "#000000", "accent_color": "#4f46e5"}
        )
        session.add(org)
        session.commit()
        session.refresh(org)

    # 2. Seed Roles
    roles_data = [
        {"name": "Admin", "permissions": ["*"]},
        {"name": "Executive", "permissions": ["read:all", "write:strategy"]},
        {"name": "ML Engineer", "permissions": ["read:all", "write:ml", "write:agent"]},
        {"name": "Reviewer", "permissions": ["read:all"]}
    ]
    
    for r_data in roles_data:
        role = session.exec(select(Role).where(Role.name == r_data["name"])).first()
        if not role:
            role = Role(**r_data)
            session.add(role)
    session.commit()

    # 3. Seed Users
    admin_role = session.exec(select(Role).where(Role.name == "Admin")).one()
    users_data = [
        {"full_name": "Patricia Lewis", "email": "p.lewis@geneye.com", "role_id": admin_role.id},
        {"full_name": "David Kim", "email": "d.kim@geneye.com", "role_id": admin_role.id},
    ]
    
    for u_data in users_data:
        user = session.exec(select(User).where(User.email == u_data["email"])).first()
        if not user:
            user = User(
                organization_id=org.id,
                hashed_password="hashed_password_placeholder", # In real app, use pwd_context.hash()
                **u_data
            )
            session.add(user)
    session.commit()

    # 4. Seed Platform Modules
    modules_data = [
        {"id": "maturity", "label": "Maturity Engine", "icon": "trending-up"},
        {"id": "portfolio", "label": "Portfolio X", "icon": "briefcase"},
        {"id": "governance", "label": "AI Governance", "icon": "shield-check"},
        {"id": "value", "label": "Value Forecast", "icon": "dollar-sign"},
        {"id": "agentcore", "label": "AgentCore", "icon": "bot"},
        {"id": "ml-studio", "label": "ML Studio", "icon": "database"},
        {"id": "physical-ai", "label": "Physical AI", "icon": "cpu"},
        {"id": "command-center", "label": "Command Center", "icon": "activity"},
    ]
    
    for m_data in modules_data:
        module = session.exec(select(PlatformModule).where(PlatformModule.id == m_data["id"])).first()
        if not module:
            module = PlatformModule(**m_data)
            session.add(module)
    session.commit()
    
    return org.id
