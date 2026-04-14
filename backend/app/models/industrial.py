import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import Column, JSON
from sqlmodel import SQLModel, Field, Relationship

class FabSite(SQLModel, table=True):
    __tablename__ = "fab_sites"
    id: str = Field(primary_key=True) # dresden, malta, singapore
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    location_flag: str # e.g., "DE", "MT", "SG"
    status: str # active, maintenance, warning
    manager_id: uuid.UUID = Field(foreign_key="users.id")
    
    metrics: List["FabMetricDaily"] = Relationship(back_populates="site")

class SiliconIpBlock(SQLModel, table=True):
    __tablename__ = "silicon_ip_blocks"
    id: str = Field(primary_key=True) # b1-b7
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    title: str # e.g., "AI Control IP", "Edge TPU config"
    description: Optional[str] = None
    
    items: List["IpBlockItem"] = Relationship(back_populates="block")
    metrics: List["IpBlockMetric"] = Relationship(back_populates="block")

class IpBlockItem(SQLModel, table=True):
    __tablename__ = "ip_block_items"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    block_id: str = Field(foreign_key="silicon_ip_blocks.id", index=True)
    
    point: str # e.g., "Identity Management", "Secure Enclave"
    status: str = Field(default="optimal")
    
    block: SiliconIpBlock = Relationship(back_populates="items")

class IpBlockMetric(SQLModel, table=True):
    __tablename__ = "ip_block_metrics"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    block_id: str = Field(foreign_key="silicon_ip_blocks.id", index=True)
    
    label: str # Latency, Power, Heat
    value: str # "< 5ms"
    
    block: SiliconIpBlock = Relationship(back_populates="metrics")

class FabMetricDaily(SQLModel, table=True):
    __tablename__ = "fab_metrics_daily"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    site_id: str = Field(foreign_key="fab_sites.id", index=True)
    
    metric_type: str # yield, uptime, cycle_time
    value: float
    timestamp: datetime = Field(default_factory=datetime.utcnow, index=True)
    
    site: FabSite = Relationship(back_populates="metrics")

class PhysicalAiOutcome(SQLModel, table=True):
    __tablename__ = "physical_ai_outcomes"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    metric_name: str # e.g., "Yield Improvement"
    current_value: str # "87.3%"
    baseline: str # "74%"
    summary: str
    driver_tags: List[str] = Field(default=[], sa_column=Column(JSON))

# --- Schemas ---

class FabMetricRead(SQLModel):
    metric_type: str
    value: float
    timestamp: datetime

class FabSiteRead(SQLModel):
    id: str
    location_flag: str
    status: str
    metrics: List[FabMetricRead] = []

class IpBlockItemRead(SQLModel):
    id: uuid.UUID
    point: str
    status: str

class IpBlockMetricRead(SQLModel):
    id: uuid.UUID
    label: str
    value: str

class IpBlockRead(SQLModel):
    id: str
    title: str
    description: Optional[str]
    items: List[IpBlockItemRead] = []
    metrics: List[IpBlockMetricRead] = []

class PhysicalAiOutcomeRead(SQLModel):
    id: uuid.UUID
    metric_name: str
    current_value: str
    baseline: str
    summary: str
    driver_tags: List[str] = []
