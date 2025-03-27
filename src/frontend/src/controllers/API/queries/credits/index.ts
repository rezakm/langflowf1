import { useQuery, useMutation } from "@tanstack/react-query";
import { getUserCreditsInfo, updateUserCreditsBalance, applyCredits, UserCreditInfo } from "../../services/credits";
import { useUserStore } from "@/stores/userStore";

/**
 * Hook to get user credit info
 * @returns current user credit info
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
 Hook to update user credit balance
 */
export const useUpdateUserCredits = () => {
  return useMutation<UserCreditInfo, Error, { userId: string; newBalance: number }>({
    mutationFn: ({ userId, newBalance }) => updateUserCreditsBalance(userId, newBalance),
  });
};

/**
Hook to apply credit deduction to user account
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