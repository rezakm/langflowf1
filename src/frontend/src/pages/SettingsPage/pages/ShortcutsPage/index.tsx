import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

export const ShortcutsPageHeader = () => {
  return (
    <div className="flex w-full items-center justify-between pb-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold">Shortcuts</h1>
        <p className="text-muted-foreground text-sm">
          Manage keyboard shortcuts for quick access
        </p>
      </div>
      <ForwardedIconComponent name="Keyboard" className="h-6 w-6" />
    </div>
  );
};

export default function ShortcutsPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-auto p-6">
      <ShortcutsPageHeader />
      <Card>
        <CardHeader>
          <CardTitle>Keyboard Shortcuts</CardTitle>
        </CardHeader>
        <CardContent>
          <p>Keyboard shortcuts will be implemented here</p>
        </CardContent>
      </Card>
    </div>
  );
}
