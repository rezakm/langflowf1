from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .routers import users, flows, files, credits

app = FastAPI()

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# روترهای اپلیکیشن
app.include_router(users.router)
app.include_router(flows.router)
app.include_router(files.router)
app.include_router(credits.router)

@app.get("/")
async def root():
    return {"message": "Welcome to the API"} 