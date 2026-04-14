import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field

class OrgBlueprint(SQLModel, table=True):
    __tablename__ = "org_blueprints"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    vision_statement: str
    operating_model_summary: str
    last_distributed: Optional[datetime] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class BlueprintPrinciple(SQLModel, table=True):
    __tablename__ = "blueprint_principles"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    letter: str # H, I, F, A, C, T, S
    label: str # e.g., "Human-Centric"
    description: str
    
    order: int

class CouncilMember(SQLModel, table=True):
    __tablename__ = "council_members"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    role_title: str # Chief AI Officer, Board AI Committee
    user_id: Optional[uuid.UUID] = Field(foreign_key="users.id", default=None)
    responsibility_tags: List[str] = Field(default=[], sa_column=Column(JSON))

class BlueprintTask(SQLModel, table=True):
    __tablename__ = "blueprint_tasks"
    id: str = Field(primary_key=True) # e.g., "task-1"
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    label: str # "Establish AI Council"
    is_done: bool = Field(default=False)
    due_date: Optional[datetime] = None
