import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

export const ApiKeysPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">API Keys</h1>
        <p className="text-muted-foreground text-sm">
          Manage API keys for accessing services
        </p>
      </div>
      <ForwardedIconComponent name="Key" className="h-6 w-6" />
    </div>
  );
};

export default function ApiKeysPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <ApiKeysPageHeader />
      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <p>API Keys management will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
