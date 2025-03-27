import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

export const MessagesPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Messages</h1>
        <p className="text-muted-foreground text-sm">
          Manage your message preferences and notifications
        </p>
      </div>
      <ForwardedIconComponent name="MessageSquare" className="h-6 w-6" />
    </div>
  );
};

export default function MessagesPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <MessagesPageHeader />
      <Card>
        <CardHeader>
          <CardTitle>Message Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Message settings will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
