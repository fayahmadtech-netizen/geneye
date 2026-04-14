import uuid
from datetime import datetime
from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database.session import get_session
from app.models.identity import User
from app.models.chat import (
    ChatSession,
    ChatSessionRead,
    ChatSessionCreate,
    ChatMessage,
    ChatMessageRead,
    ChatMessageCreate
)
from app.routes.deps import get_current_user

router = APIRouter()

@router.get("/sessions", response_model=List[ChatSessionRead])
def get_chat_sessions(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Returns all chat sessions for the current user.
    """
    statement = select(ChatSession).where(
        ChatSession.organization_id == current_user.organization_id,
        ChatSession.user_id == current_user.id,
        ChatSession.is_archived == False
    ).order_by(ChatSession.created_at.desc())
    
    sessions = session.exec(statement).all()
    return sessions

@router.post("/sessions", response_model=ChatSessionRead)
def create_chat_session(
    session_in: ChatSessionCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Starts a new conversational AI session.
    """
    db_session = ChatSession(
        organization_id=current_user.organization_id,
        user_id=current_user.id,
        **session_in.model_dump()
    )
    session.add(db_session)
    session.commit()
    session.refresh(db_session)
    
    # Optional: Add a system or greeting message
    greeting = ChatMessage(
        session_id=db_session.id,
        role="assistant",
        content="Hello! How can I assist you with your operations today?"
    )
    session.add(greeting)
    session.commit()
    session.refresh(db_session)
    
    return db_session

@router.get("/sessions/{session_id}/messages", response_model=List[ChatMessageRead])
def get_session_messages(
    session_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Retrieves the message history for a specific session.
    """
    chat_session = session.get(ChatSession, session_id)
    if not chat_session or chat_session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")
        
    statement = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc())
    messages = session.exec(statement).all()
    return messages

@router.post("/sessions/{session_id}/messages", response_model=List[ChatMessageRead])
def post_chat_message(
    session_id: uuid.UUID,
    message_in: ChatMessageCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
) -> Any:
    """
    Appends a user message to the session, and generates a mocked AI response.
    Returns the updated message list.
    """
    chat_session = session.get(ChatSession, session_id)
    if not chat_session or chat_session.user_id != current_user.id:
        raise HTTPException(status_code=404, detail="Session not found")
        
    # 1. Save user message
    user_msg = ChatMessage(
        session_id=session_id,
        role="user",
        content=message_in.content
    )
    session.add(user_msg)
    
    # 2. Generate a Mock AI Response
    # In the future, you would call `openai.ChatCompletion` or `gemini` here.
    mock_reply = "I understand you are asking about: '" + message_in.content[:20] + "...'. As an internal AI agent, I have processed your request. Everything looks optimal."
    
    ai_msg = ChatMessage(
        session_id=session_id,
        role="assistant",
        content=mock_reply
    )
    session.add(ai_msg)

    chat_session.updated_at = datetime.utcnow()
    session.add(chat_session)

    session.commit()
    
    # Return full message history
    statement = select(ChatMessage).where(ChatMessage.session_id == session_id).order_by(ChatMessage.created_at.asc())
    messages = session.exec(statement).all()
    
    return messages
