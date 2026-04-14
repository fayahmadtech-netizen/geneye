import sys
import os

# Add the project root to sys.path so we can import 'app'
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..")))

from sqlmodel import Session, select
from app.database.session import engine
from app.models.identity import User
from app.seed.identity import seed_identity
from app.seed.strategy import seed_strategy
from app.seed.operations import seed_operations
from app.seed.portfolio import seed_portfolio
from app.seed.agentic import seed_agentic

def run_seed():
    print("Starting GenEye Platform Seeding...")
    with Session(engine) as session:
        # 1. Identity & Core (Crucial for organization_id)
        org_id = seed_identity(session)
        
        # Get admin user for ownership
        admin = session.exec(select(User).where(User.email == "p.lewis@geneye.com")).one()
        admin_id = admin.id
        
        # 2. Domain Data
        seed_strategy(session, org_id)
        seed_operations(session, org_id, admin_id)
        seed_portfolio(session, org_id)
        seed_agentic(session, org_id)
        
        print("\nSeeding Complete! 69-table platform is now populated.")

if __name__ == "__main__":
    run_seed()
