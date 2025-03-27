import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

export const GeneralPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">General Settings</h1>
        <p className="text-muted-foreground text-sm">
          Manage general application settings
        </p>
      </div>
      <ForwardedIconComponent name="Settings" className="h-6 w-6" />
    </div>
  );
};

export default function GeneralPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <GeneralPageHeader />
      <Card>
        <CardHeader>
          <CardTitle>Application Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p>General settings will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
