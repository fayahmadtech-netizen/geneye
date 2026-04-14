import uuid
from datetime import datetime
from typing import List, Optional, Dict
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

class Organization(SQLModel, table=True):
    __tablename__ = "organizations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str = Field(index=True)
    subdomain: str = Field(unique=True, index=True)
    logo_url: Optional[str] = None
    branding_config: Dict = Field(default={}, sa_column=Column(JSON))
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    # Relationships
    users: List["User"] = Relationship(back_populates="organization")

class Role(SQLModel, table=True):
    __tablename__ = "roles"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    name: str # Admin, CAIO, BU Lead, Developer
    permissions: List[str] = Field(default=[], sa_column=Column(JSON))
    
    users: List["User"] = Relationship(back_populates="role")

class User(SQLModel, table=True):
    __tablename__ = "users"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    full_name: str
    avatar_url: Optional[str] = None
    role_id: uuid.UUID = Field(foreign_key="roles.id")
    is_active: bool = Field(default=True)
    last_login: Optional[datetime] = None
    
    # Relationships
    organization: Organization = Relationship(back_populates="users")
    role: Role = Relationship(back_populates="users")

# --- Schemas ---

class UserCreate(SQLModel):
    email: str
    password: str
    full_name: str
    organization_id: uuid.UUID
    role_id: uuid.UUID

class UserPublic(SQLModel):
    id: uuid.UUID
    email: str
    full_name: str
    organization_id: uuid.UUID
    role_id: uuid.UUID
    is_active: bool

class PlatformModule(SQLModel, table=True):
    __tablename__ = "platform_modules"
    id: str = Field(primary_key=True) # maturity, portfolio, agentcore, etc.
    label: str
    icon: str
    is_enabled: bool = True

class Integration(SQLModel, table=True):
    __tablename__ = "integrations"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id")
    provider: str # Salesforce, Jira, etc.
    config: Dict = Field(default={}, sa_column=Column(JSON))
    status: str = Field(default="pending") # connected, error, pending

class ActivityLog(SQLModel, table=True):
    __tablename__ = "activity_logs"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id")
    user_id: uuid.UUID = Field(foreign_key="users.id")
    action: str
    resource_type: str
    resource_id: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)
