import { useState } from "react";
import ForwardedIconComponent from "@/components/common/genericIconComponent";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useGetUserCredits } from "@/controllers/API/queries/credits";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@/components/ui/button";
import useAlertStore from "@/stores/alertStore";
import { Loading } from "@/components/ui/loading";

export const CreditsPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Credits</h1>
        <p className="text-muted-foreground text-sm">
          Manage your account credits and usage
        </p>
      </div>
      <ForwardedIconComponent name="Coins" className="h-6 w-6" />
    </div>
  );
};

export default function CreditsPage() {
  const userId = useUserStore((state) => state.user?.id);
  const { data: userCreditsInfo, isLoading } = useGetUserCredits();
  const [creditAmount, setCreditAmount] = useState<number>(100);
  const setSuccessData = useAlertStore((state) => state.setSuccessData);

  const handlePurchaseCredits = () => {
    // Here you can implement credit purchase logic
    // For example, call an API or redirect to a payment gateway
    setSuccessData({
      title: "Purchase Requested",
      list: [
        `You have requested to purchase ${creditAmount} credits.`,
        "Our team will contact you shortly to complete the purchase process."
      ]
    });
  };

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loading size="lg" />
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <CreditsPageHeader />

      <div className="flex flex-col gap-6">
        {/* Credit Balance Card */}
        <CardContent className="p-6 shadow-md">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              Current Credit Balance
            </CardTitle>
          </CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <ForwardedIconComponent name="Coins" className="h-8 w-8 text-primary" />
              <div className="text-3xl font-bold">
                {userCreditsInfo?.currentBalance || 0}
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </div>
        </CardContent>

        {/* Credit Usage Statistics */}
        <CardContent className="p-6 shadow-md">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              Credit Usage
            </CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between border-b py-2">
              <span>Total Credits Used</span>
              <span className="font-medium">{userCreditsInfo?.totalCreditsUsed || 0}</span>
            </div>
            <div className="flex items-center justify-between border-b py-2">
              <span>Current Balance</span>
              <span className="font-medium">{userCreditsInfo?.currentBalance || 0}</span>
            </div>
          </div>
        </CardContent>

        {/* Purchase Credits */}
        <CardContent className="p-6 shadow-md">
          <CardHeader className="p-0 pb-4">
            <CardTitle className="text-xl font-semibold">
              Purchase Credits
            </CardTitle>
          </CardHeader>
          <div className="flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">
              Select the amount of credits you want to purchase:
            </p>
            <div className="flex gap-4">
              <Input
                type="number"
                min={1}
                value={creditAmount}
                onChange={(e) => setCreditAmount(parseInt(e.target.value))}
                className="w-32"
              />
              <Button onClick={handlePurchaseCredits}>
                Purchase Credits
              </Button>
            </div>
          </div>
        </CardContent>
      </div>
    </div>
  );
} 