import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

export const GlobalVariablesPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Global Variables</h1>
        <p className="text-muted-foreground text-sm">
          Manage global variables for your application
        </p>
      </div>
      <ForwardedIconComponent name="Globe" className="h-6 w-6" />
    </div>
  );
};

export default function GlobalVariablesPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <GlobalVariablesPageHeader />
      <Card>
        <CardHeader>
          <CardTitle>Global Variables</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Global variables management will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
