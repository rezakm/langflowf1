import SideBarButtonsComponent from "@/components/core/sidebarComponent";
import { SidebarProvider } from "@/components/ui/sidebar";
import {
  ENABLE_DATASTAX_LANGFLOW,
  ENABLE_PROFILE_ICONS,
} from "@/customization/feature-flags";
import useAuthStore from "@/stores/authStore";
import { useStoreStore } from "@/stores/storeStore";
import { Outlet } from "react-router-dom";
import ForwardedIconComponent from "../../components/common/genericIconComponent";
import PageLayout from "../../components/common/pageLayout";
import CreditsPage from "./pages/CreditsPage";
import { useParams } from "react-router-dom";
import { useMemo } from "react";

export default function SettingsPage(): JSX.Element {
  const autoLogin = useAuthStore((state) => state.autoLogin);
  const hasStore = useStoreStore((state) => state.hasStore);
  const params = useParams();
  const page = params.page ?? "general";

  // Hides the General settings if there is nothing to show
  const showGeneralSettings = ENABLE_PROFILE_ICONS || hasStore || !autoLogin;

  const sidebarNavItems: {
    href?: string;
    title: string;
    icon: React.ReactNode;
  }[] = [];

  if (showGeneralSettings) {
    sidebarNavItems.push({
      title: "General",
      href: "/settings/general",
      icon: (
        <ForwardedIconComponent
          name="SlidersHorizontal"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    });
  }

  sidebarNavItems.push(
    {
      title: "Global Variables",
      href: "/settings/global-variables",
      icon: (
        <ForwardedIconComponent
          name="Globe"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },

    {
      title: "Shortcuts",
      href: "/settings/shortcuts",
      icon: (
        <ForwardedIconComponent
          name="Keyboard"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
    {
      title: "Messages",
      href: "/settings/messages",
      icon: (
        <ForwardedIconComponent
          name="MessagesSquare"
          className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
        />
      ),
    },
  );

  if (!ENABLE_DATASTAX_LANGFLOW) {
    const langflowItems = [
      {
        title: "Deeptern API Keys",
        href: "/settings/api-keys",
        icon: (
          <ForwardedIconComponent
            name="Key"
            className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
          />
        ),
      },
      {
        title: "Deeptern Store",
        href: "/settings/store",
        icon: (
          <ForwardedIconComponent
            name="Store"
            className="w-4 flex-shrink-0 justify-start stroke-[1.5]"
          />
        ),
      },
    ];

    sidebarNavItems.splice(2, 0, ...langflowItems);
  }

  const settingsTypes = useMemo(
    () => [
      {
        title: "General",
        description: "General settings",
        icon: <ForwardedIconComponent name="Settings" className="h-4 w-4" />,
        path: "/settings/general",
      },
      {
        title: "API Keys",
        description: "Manage API Keys",
        icon: <ForwardedIconComponent name="Key" className="h-4 w-4" />,
        path: "/settings/api-keys",
      },
      {
        title: "Global Variables",
        description: "Manage Global Variables",
        icon: <ForwardedIconComponent name="Variable" className="h-4 w-4" />,
        path: "/settings/global-variables",
      },
      {
        title: "Messages",
        description: "Manage Messages",
        icon: <ForwardedIconComponent name="MessageSquare" className="h-4 w-4" />,
        path: "/settings/messages",
      },
      {
        title: "Credits",
        description: "Manage Credits",
        icon: <ForwardedIconComponent name="CreditCard" className="h-4 w-4" />,
        path: "/settings/credits",
      },
      {
        title: "Shortcuts",
        description: "Manage Shortcuts",
        icon: <ForwardedIconComponent name="Keyboard" className="h-4 w-4" />,
        path: "/settings/shortcuts",
      },
    ],
    [],
  );

  return (
    <PageLayout
      backTo={"/"}
      title="Settings"
      description="Manage the general settings for Deeptern."
    >
      <SidebarProvider width="15rem" defaultOpen={false}>
        <SideBarButtonsComponent items={sidebarNavItems} />
        <main className="flex flex-1 overflow-hidden">
          <div className="flex flex-1 flex-col overflow-x-hidden pt-1">
            <div className="relative flex flex-1 overflow-auto">
              {page === "general" && <GeneralPage />}
              {page === "api-keys" && <ApiKeysPage />}
              {page === "global-variables" && <GlobalVariablesPage />}
              {page === "messages" && <MessagesPage />}
              {page === "credits" && <CreditsPage />}
              {page === "shortcuts" && <ShortcutsPage />}
            </div>
          </div>
        </main>
      </SidebarProvider>
    </PageLayout>
  );
}
