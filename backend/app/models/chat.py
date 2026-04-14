import uuid
from datetime import datetime
from typing import List, Optional
from sqlmodel import SQLModel, Field, Relationship

class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    
    title: str = Field(default="New Conversation")
    mode: str # internal, web
    model_id: str # e.g., google/gemini-3
    
    is_archived: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    messages: List["ChatMessage"] = Relationship(back_populates="session")

class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="chat_sessions.id", index=True)
    
    role: str # user, assistant, system
    content: str
    
    created_at: datetime = Field(default_factory=datetime.utcnow)
    
    session: ChatSession = Relationship(back_populates="messages")
    attachments: List["ChatAttachment"] = Relationship(back_populates="message")

class ChatAttachment(SQLModel, table=True):
    __tablename__ = "chat_attachments"
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    message_id: uuid.UUID = Field(foreign_key="chat_messages.id", index=True)
    
    file_name: str
    file_type: str
    file_size_bytes: int
    storage_path: str # Supabase storage path
    
    message: ChatMessage = Relationship(back_populates="attachments")

# --- Schemas ---

class ChatMessageRead(SQLModel):
    id: uuid.UUID
    role: str
    content: str
    created_at: datetime
    # Omitting attachments for now for simplicity

class ChatSessionRead(SQLModel):
    id: uuid.UUID
    title: str
    mode: str
    model_id: str
    is_archived: bool
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessageRead] = []

class ChatSessionCreate(SQLModel):
    title: Optional[str] = "New Conversation"
    mode: str = "internal"
    model_id: str = "internal-default"

class ChatMessageCreate(SQLModel):
    content: str
