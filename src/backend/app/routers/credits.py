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
    دریافت اطلاعات کردیت کاربر
    """
    # اطمینان از دسترسی کاربر به اطلاعات
    if current_user["id"] != user_id and not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403, detail="شما مجاز به دسترسی به این اطلاعات نیستید"
        )

    # اجرای کوئری برای محاسبه کل کردیت مصرفی
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
    
    # دریافت اطلاعات موجودی کردیت کاربر
    balance_query = text("""
        SELECT current_balance
        FROM "user_credit_balance"
        WHERE user_id = :user_id
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
    به‌روزرسانی موجودی کردیت کاربر
    """
    # فقط ادمین‌ها می‌توانند موجودی کردیت کاربران را تغییر دهند
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403, detail="شما مجاز به تغییر موجودی کردیت نیستید"
        )
    
    # به‌روزرسانی موجودی کردیت
    update_query = text("""
        INSERT INTO "user_credit_balance" (user_id, current_balance)
        VALUES (:user_id, :new_balance)
        ON CONFLICT (user_id) DO UPDATE
        SET current_balance = :new_balance
    """)
    
    await session.execute(update_query, {"user_id": user_id, "new_balance": new_balance})
    await session.commit()
    
    # دریافت اطلاعات به‌روز شده
    return await get_user_credits_info(user_id, session, current_user)


@router.post("/apply", response_model=ApplyCreditResponse)
async def apply_credits_endpoint(
    request: ApplyCreditRequest,
    session: AsyncSession = Depends(get_session),
    current_user: Dict[str, Any] = Depends(get_current_user),
) -> ApplyCreditResponse:
    """
    اعمال کسر کردیت از حساب کاربر برای یک فعالیت
    """
    user_id = request.userId
    consumed_credits = request.consumedCredits
    
    # اطمینان از دسترسی کاربر
    if current_user["id"] != user_id and not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=403, detail="شما مجاز به اعمال کردیت برای این کاربر نیستید"
        )
    
    # دریافت موجودی کردیت کاربر
    balance_query = text("""
        SELECT current_balance
        FROM "user_credit_balance"
        WHERE user_id = :user_id
    """)
    
    balance_result = await session.execute(balance_query, {"user_id": user_id})
    balance_row = balance_result.fetchone()
    
    current_balance = balance_row[0] if balance_row else 0
    
    # اعمال منطق کسر کردیت
    if current_balance >= consumed_credits:
        new_balance = current_balance - consumed_credits
        extra_charge = 0
    else:
        extra_charge = consumed_credits - current_balance
        new_balance = 0
    
    # به‌روزرسانی موجودی کردیت
    update_query = text("""
        INSERT INTO "user_credit_balance" (user_id, current_balance)
        VALUES (:user_id, :new_balance)
        ON CONFLICT (user_id) DO UPDATE
        SET current_balance = :new_balance
    """)
    
    await session.execute(update_query, {"user_id": user_id, "new_balance": new_balance})
    
    # ثبت تراکنش
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