import { apiBase } from "../base";

export interface UserCreditInfo {
  userId: string;
  totalCreditsUsed: number;
  currentBalance: number;
}

/**
 * دریافت اطلاعات کردیت کاربر
 * @param userId شناسه کاربر
 * @returns اطلاعات کردیت کاربر شامل موجودی و میزان مصرف
 */
export const getUserCreditsInfo = async (userId: string): Promise<UserCreditInfo> => {
  const response = await apiBase.get(`/api/credits/user/${userId}`);
  return response.data;
};

/**
 * به‌روزرسانی موجودی کردیت کاربر
 * @param userId شناسه کاربر
 * @param newBalance موجودی جدید
 * @returns اطلاعات به‌روز شده کردیت کاربر
 */
export const updateUserCreditsBalance = async (userId: string, newBalance: number): Promise<UserCreditInfo> => {
  const response = await apiBase.put(`/api/credits/user/${userId}`, {
    newBalance
  });
  return response.data;
};

/**
 * اعمال کسر کردیت برای فعالیت کاربر
 * @param userId شناسه کاربر
 * @param consumedCredits میزان کردیت مصرفی
 * @returns نتیجه محاسبه شامل هزینه اضافی و موجودی جدید
 */
export const applyCredits = async (userId: string, consumedCredits: number): Promise<{
  extraCharge: number;
  newBalance: number;
}> => {
  const response = await apiBase.post(`/api/credits/apply`, {
    userId,
    consumedCredits
  });
  return response.data;
}; 