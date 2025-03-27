from pydantic import BaseModel, EmailStr, Field
from typing import Optional


class UserBase(BaseModel):
    """
    Base model for user data
    """
    username: str
    email: EmailStr
    

class UserCreate(UserBase):
    """
    Model for creating a new user
    """
    password: str
    

class UserUpdate(BaseModel):
    """
    Model for updating user information
    """
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    password: Optional[str] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    """
    Model for user response data
    """
    id: str
    is_active: bool
    is_superuser: bool
    initial_free_credits: float = Field(default=500.0)
    credits_balance: float = Field(default=500.0)
    
    class Config:
        from_attributes = True 