import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserCreditsInfo, updateUserCreditsBalance, applyCredits, UserCreditInfo } from "../../services/credits";
import { useUserStore } from "@/stores/userStore";

/**
 * هوک برای دریافت اطلاعات کردیت کاربر
 * @returns اطلاعات کردیت کاربر فعلی
 */
export const useGetUserCredits = () => {
  const userId = useUserStore((state) => state.user?.id);

  return useQuery<UserCreditInfo, Error>({
    queryKey: ["userCredits", userId],
    queryFn: () => getUserCreditsInfo(userId!),
    enabled: !!userId,
  });
};

/**
 * هوک برای به‌روزرسانی موجودی کردیت کاربر
 */
export const useUpdateUserCredits = () => {
  return useMutation<UserCreditInfo, Error, { userId: string; newBalance: number }>({
    mutationFn: ({ userId, newBalance }) => updateUserCreditsBalance(userId, newBalance),
  });
};

/**
 * هوک برای اعمال کسر کردیت از حساب کاربر
 */
export const useApplyCredits = () => {
  return useMutation<
    { extraCharge: number; newBalance: number },
    Error,
    { userId: string; consumedCredits: number }
  >({
    mutationFn: ({ userId, consumedCredits }) => applyCredits(userId, consumedCredits),
  });
}; 