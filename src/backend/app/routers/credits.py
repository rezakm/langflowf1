from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import text
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Dict, Any

from ..models.credits import UserCreditInfo, ApplyCreditRequest, ApplyCreditResponse
from ..database.session import get_session
from ..auth.auth import get_current_user

router = APIRouter(prefix="/api/credits", tags=["credits"])


@router.get("/user/{user_id}", response_model=UserCreditInfo)
async def get_user_credits_info(
    user_id: str,
    session: AsyncSession = Depends(get_session),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> UserCreditInfo:
    """
    Get user credit information
    """
    # Ensure user has access to this information
    if current_user["id"] != user_id and not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403, detail="You are not authorized to access this information"
        )

    # Get transaction history for total used credits
    query = text("""
        SELECT 
            SUM(t.consumed_credits) AS total_credits_used
        FROM 
            "transaction" t
        JOIN 
            "flow" f ON t.flow_id = f.id
        WHERE
            f.user_id = :user_id
        GROUP BY 
            f.user_id
    """)
    
    result = await session.execute(query, {"user_id": user_id})
    row = result.fetchone()
    
    total_credits_used = row[0] if row else 0
    
    # Get user's current credit balance from user table
    balance_query = text("""
        SELECT credits_balance
        FROM "user"
        WHERE id = :user_id
    """)
    
    balance_result = await session.execute(balance_query, {"user_id": user_id})
    balance_row = balance_result.fetchone()
    
    current_balance = balance_row[0] if balance_row else 0
    
    return UserCreditInfo(
        userId=user_id,
        totalCreditsUsed=total_credits_used,
        currentBalance=current_balance
    )


@router.put("/user/{user_id}", response_model=UserCreditInfo)
async def update_user_credits_balance(
    user_id: str,
    new_balance: int,
    session: AsyncSession = Depends(get_session),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> UserCreditInfo:
    """
    Update user credit balance
    """
    # Only admins can change credit balance
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403, detail="You are not authorized to update credit balance"
        )
    
    # Update credit balance directly in user table
    update_query = text("""
        UPDATE "user"
        SET credits_balance = :new_balance
        WHERE id = :user_id
    """)
    
    await session.execute(update_query, {"user_id": user_id, "new_balance": new_balance})
    await session.commit()
    
    # Get updated information
    return await get_user_credits_info(user_id, session, current_user)


@router.post("/apply", response_model=ApplyCreditResponse)
async def apply_credits_endpoint(
    request: ApplyCreditRequest,
    session: AsyncSession = Depends(get_session),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> ApplyCreditResponse:
    """
    Apply credit deduction for user activity
    """
    user_id = request.userId
    consumed_credits = request.consumedCredits
    
    # Ensure user has access
    if current_user["id"] != user_id and not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403, detail="You are not authorized to apply credits for this user"
        )
    
    # Get user's current credit balance
    balance_query = text("""
        SELECT credits_balance
        FROM "user"
        WHERE id = :user_id
    """)
    
    balance_result = await session.execute(balance_query, {"user_id": user_id})
    balance_row = balance_result.fetchone()
    
    if not balance_row:
        raise HTTPException(status_code=404, detail="User not found")
    
    current_balance = balance_row[0] if balance_row else 0
    
    # Apply credit deduction logic
    if current_balance >= consumed_credits:
        new_balance = current_balance - consumed_credits
        extra_charge = 0
        
        # Update user's credit balance
        update_query = text("""
            UPDATE "user" 
            SET credits_balance = credits_balance - :consumed_credits
            WHERE id = :user_id AND credits_balance >= :consumed_credits
        """)
        
        await session.execute(update_query, {
            "user_id": user_id,
            "consumed_credits": consumed_credits
        })
    else:
        extra_charge = consumed_credits - current_balance
        new_balance = 0
        
        # Set balance to zero if not enough credits
        update_query = text("""
            UPDATE "user" 
            SET credits_balance = 0
            WHERE id = :user_id
        """)
        
        await session.execute(update_query, {"user_id": user_id})
    
    # Log the transaction
    transaction_query = text("""
        INSERT INTO "credit_transaction" (user_id, consumed_credits, extra_charge, new_balance, transaction_date)
        VALUES (:user_id, :consumed_credits, :extra_charge, :new_balance, NOW())
    """)
    
    await session.execute(
        transaction_query, 
        {
            "user_id": user_id, 
            "consumed_credits": consumed_credits,
            "extra_charge": extra_charge,
            "new_balance": new_balance
        }
    )
    
    await session.commit()
    
    return ApplyCreditResponse(
        extraCharge=extra_charge,
        newBalance=new_balance
    ) 