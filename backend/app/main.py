from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config.settings import settings
from app.database.session import init_db
from app.routes import auth, maturity, portfolio, industrial, agentic, mlops, governance, engineering, chat, readiness

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

# Set up CORS (comma-separated origins in .env for localhost vs 127.0.0.1 dev)
_cors_origins = [
    o.strip()
    for o in settings.ALLOWED_CORS_ORIGIN.split(",")
    if o.strip()
]
if not _cors_origins:
    _cors_origins = ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["auth"])
app.include_router(maturity.router, prefix=f"{settings.API_V1_STR}/maturity", tags=["maturity"])
app.include_router(portfolio.router, prefix=f"{settings.API_V1_STR}/portfolio", tags=["portfolio"])
app.include_router(industrial.router, prefix=f"{settings.API_V1_STR}/industrial", tags=["industrial"])
app.include_router(agentic.router, prefix=f"{settings.API_V1_STR}/agentic", tags=["agentic"])
app.include_router(mlops.router, prefix=f"{settings.API_V1_STR}/mlops", tags=["mlops"])
app.include_router(governance.router, prefix=f"{settings.API_V1_STR}/governance", tags=["governance"])
app.include_router(engineering.router, prefix=f"{settings.API_V1_STR}/engineering", tags=["engineering"])
app.include_router(chat.router, prefix=f"{settings.API_V1_STR}/chat", tags=["chat"])
app.include_router(readiness.router, prefix=f"{settings.API_V1_STR}/readiness", tags=["readiness"])

@app.on_event("startup")
def on_startup():
    # Initialize the database and create all 72 tables if they don't exist
    print("Initializing Database...")
    init_db()
    print("Database Initialized Successfully.")

@app.get("/")
def root():
    return {
        "message": "GenEye Backend is Live",
        "status": "healthy",
        "version": "1.0.0"
    }