from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import text, select
from ..models.user import UserCreate, UserResponse, UserUpdate
from passlib.context import CryptContext

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

async def create_user(session: AsyncSession, user_data: UserCreate) -> UserResponse:
    """
    Create a new user with initial free credits
    """
    # Hash the password
    hashed_password = get_password_hash(user_data.password)
    
    # Insert query with initial credits (DEFAULT values will be used from the schema)
    query = text("""
        INSERT INTO "user" (username, email, password, is_active, is_superuser)
        VALUES (:username, :email, :password, :is_active, :is_superuser)
        RETURNING id, username, email, is_active, is_superuser, initial_free_credits, credits_balance
    """)
    
    # Execute query
    result = await session.execute(
        query,
        {
            "username": user_data.username,
            "email": user_data.email,
            "password": hashed_password,
            "is_active": True,
            "is_superuser": False,
        }
    )
    
    # Get the inserted user
    user_row = result.fetchone()
    
    # Commit the transaction
    await session.commit()
    
    # Create response
    return UserResponse(
        id=user_row.id,
        username=user_row.username,
        email=user_row.email,
        is_active=user_row.is_active,
        is_superuser=user_row.is_superuser,
        initial_free_credits=user_row.initial_free_credits,
        credits_balance=user_row.credits_balance
    )

async def get_user_by_id(session: AsyncSession, user_id: str) -> UserResponse:
    """
    Get user by ID
    """
    query = text("""
        SELECT id, username, email, is_active, is_superuser, initial_free_credits, credits_balance
        FROM "user"
        WHERE id = :user_id
    """)
    
    result = await session.execute(query, {"user_id": user_id})
    user_row = result.fetchone()
    
    if not user_row:
        return None
    
    return UserResponse(
        id=user_row.id,
        username=user_row.username,
        email=user_row.email,
        is_active=user_row.is_active,
        is_superuser=user_row.is_superuser,
        initial_free_credits=user_row.initial_free_credits,
        credits_balance=user_row.credits_balance
    )

async def update_user(session: AsyncSession, user_id: str, user_data: UserUpdate) -> UserResponse:
    """
    Update user information
    """
    # Create update query
    update_values = {}
    update_fields = []
    
    # Add fields to update only if they are provided
    if user_data.username is not None:
        update_fields.append("username = :username")
        update_values["username"] = user_data.username
    
    if user_data.email is not None:
        update_fields.append("email = :email")
        update_values["email"] = user_data.email
    
    if user_data.password is not None:
        update_fields.append("password = :password")
        update_values["password"] = get_password_hash(user_data.password)
    
    if user_data.is_active is not None:
        update_fields.append("is_active = :is_active")
        update_values["is_active"] = user_data.is_active
    
    # Only proceed if there are fields to update
    if update_fields:
        update_values["user_id"] = user_id
        
        # Construct the update query
        update_query = text(f"""
            UPDATE "user"
            SET {', '.join(update_fields)}
            WHERE id = :user_id
        """)
        
        await session.execute(update_query, update_values)
        await session.commit()
    
    # Return the updated user
    return await get_user_by_id(session, user_id) 