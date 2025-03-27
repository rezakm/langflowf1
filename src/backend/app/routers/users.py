from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from ..models.user import UserCreate, UserResponse, UserUpdate
from ..database.session import get_session
from ..services.user_service import create_user, get_user_by_id, update_user
from ..auth.auth import get_current_user
from typing import Dict, Any

router = APIRouter(prefix="/api/users", tags=["users"])

@router.post("/", response_model=UserResponse)
async def register_user(
    user_data: UserCreate, 
    session: AsyncSession = Depends(get_session)
) -> UserResponse:
    """
    Register a new user with initial free credits
    """
    # User registration logic
    user = await create_user(session, user_data)
    
    # Ensure the user is created with initial free credits
    # The default values in the database schema should handle this automatically
    # since we've added the initial_free_credits and credits_balance columns with DEFAULT 500
    
    return user 