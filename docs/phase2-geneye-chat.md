# GenEye — Phase 2: Route Specification — `/geneye-chat`

> **Analysis Date:** 2026-04-12
> **Mangled Component:** `zPe` (page)
> **Target Rebuild Stack:** Next.js · Tailwind CSS · FastAPI / Supabase Edge Functions · PostgreSQL · SQLModel

---

## Route Overview

**URL:** `/geneye-chat`
**Page Title:** "GenEye Chat"
**Subtitle:** "AI-powered enterprise intelligence"

This is the **conversational AI interface** of the GenEye platform. It allows users to interact with the platform's data (Maturity, ROI, Governance, etc.) via an "Internal" mode or perform general AI tasks/research via a "Web" mode. It supports multi-modal inputs (text + files), model switching, and real-time streaming responses.

---

## 1. Hardcoded Data — Full Extraction

### 1.1 `v5[]` — Model Registry (Available LLMs)

| ID | Label | Provider | Description |
|---|---|---|---|
| `auto` | Auto | GenEye | Best model selected automatically |
| `google/gemini-3-flash-preview` | Gemini 3 Flash | Google | Fast, next-gen Gemini |
| `google/gemini-2.5-pro` | Gemini 2.5 Pro | Google | Top-tier reasoning & vision |
| `google/gemini-2.5-flash` | Gemini 2.5 Flash | Google | Balanced speed & capability |
| `openai/gpt-5` | GPT-5 | OpenAI | Powerful all-rounder |
| `openai/gpt-5-mini` | GPT-5 Mini | OpenAI | Efficient & capable |
| `openai/gpt-5.2` | GPT-5.2 | OpenAI | Enhanced reasoning |

---

### 1.2 Chat Suggestions (Quick Start)

**Internal Mode Suggestions:**
* "What's our current AI maturity score?"
* "Summarize active portfolio initiatives"
* "Show governance compliance status"
* "What are our top value realization metrics?"

**Web Mode Suggestions:**
* "Latest enterprise AI adoption trends"
* "Compare top LLM providers for 2026"
* "EU AI Act compliance checklist"
* "ROI benchmarks for AI programs"

---

## 2. API Design & Streaming Logic

### 2.1 The Chat Protocol (SSE)

The component communicates with a Supabase Edge Function: `${SUPABASE_URL}/functions/v1/geneye-chat`.

**Request Payload:**
```json
{
  "messages": [
    { "role": "user", "content": "What is our ROI?" },
    { "role": "assistant", "content": "Our ROI is 4.2x." },
    { "role": "user", "content": "How was it calculated?" }
  ],
  "model": "google/gemini-3-flash-preview",
  "mode": "internal"
}
```

**Response Handling:**
- The server responds with a `Text/Event-Stream`.
- Chunks follow the OpenAI-compatible delta format: `data: {"choices": [{"delta": {"content": "..."}}]}`.
- Stream concludes with `data: [DONE]`.

---

## 3. Data Models (SQLModel / PostgreSQL)

### 3.1 Social & Messaging Schema

```python
class ChatSession(SQLModel, table=True):
    __tablename__ = "chat_sessions"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id", index=True)
    organization_id: uuid.UUID = Field(foreign_key="organizations.id", index=True)
    
    title: str = Field(default="New Conversation")
    mode: str # 'internal' | 'web'
    model_id: str # e.g. 'google/gemini-3-flash-preview'
    
    is_archived: bool = Field(default=False)
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

class ChatMessage(SQLModel, table=True):
    __tablename__ = "chat_messages"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    session_id: uuid.UUID = Field(foreign_key="chat_sessions.id", index=True)
    
    role: str # 'user' | 'assistant' | 'system'
    content: str
    
    # Metadata for multi-model tracking
    model_used: Optional[str] = None
    prompt_tokens: Optional[int] = None
    completion_tokens: Optional[int] = None
    
    created_at: datetime = Field(default_factory=datetime.utcnow)

class ChatAttachment(SQLModel, table=True):
    __tablename__ = "chat_attachments"
    
    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    message_id: uuid.UUID = Field(foreign_key="chat_messages.id", index=True)
    
    file_name: str
    file_type: str
    file_size_bytes: int
    storage_path: str # S3 / Supabase Storage path
```

---

## 4. Frontend Component Tree (Next.js)

```
app/
└── geneye-chat/
    └── page.tsx                              ← Chat viewport container
        ├── <ChatHeader />                    ← Mode switcher (Internal/Web) + Clear Button
        ├── <MessageList />                   ← Scrollable area with auto-scroll ref
        │     ├── <SuggestionsGrid />         ← Suggestions for empty state
        │     └── <ChatBubble />              ← User/AI bubbles with markdown support
        │           └── <FilePreviewList />   ← Attached docs per message
        ├── <ChatInputArea />                 ← Multi-line text area + File Upload
        │     ├── <AttachmentToolbar />       ← Local file state management
        │     └── <ModelSelector />           ← Popover to switch LLM models
        └── <ChatSidebar />                   ← (New for Rebuild) Session history list
```

---

## 5. Key Design Decisions

1.  **Stateful Chat Rebuild**: The static bundle uses purely local state (`e` array). For the rebuild, we will use a **Server Side Session** model where each chat is saved to the DB, allowing users to return to past conversations.
2.  **Internal Mode RAG**: The "Internal" mode is a placeholder in the static bundle. The rebuild will implement a **RAG (Retrieval-Augmented Generation)** pipeline that fetches context from:
    - `use_cases` (Portfolio)
    - `maturity_assessments`
    - `financial_metrics` (Value)
    - `governance_risk_items`
3.  **Streaming Resilience**: The use of `AbortController` in the original code is correct and will be preserved to allow users to cancel long-running generations.
4.  **File Interrogation**: Attachments are read via `FileReader` in the bundle. The rebuild will upload them to **Supabase Storage** and include them in the LLM context (Multi-modal or OCR pre-processing).

**Final Running Total: 69 Tables (fully normalized enterprise schema)**
