from pydantic import BaseModel


class UserCreditInfo(BaseModel):
    """
    مدل برای اطلاعات کردیت کاربر
    """
    userId: str
    totalCreditsUsed: float
    currentBalance: float
    
    class Config:
        from_attributes = True


class ApplyCreditRequest(BaseModel):
    """
    مدل برای درخواست کسر کردیت
    """
    userId: str
    consumedCredits: float


class ApplyCreditResponse(BaseModel):
    """
    مدل برای پاسخ کسر کردیت
    """
    extraCharge: float
    newBalance: float 