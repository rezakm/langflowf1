import { CustomLink } from "@/customization/components/custom-link";
import { useIsMobile } from "@/hooks/use-mobile";
import { useGetUserCredits } from "@/controllers/API/queries/credits";
import { useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "../../ui/sidebar";
import ForwardedIconComponent from "@/components/common/genericIconComponent";

type SideBarButtonsComponentProps = {
  items: {
    href?: string;
    title: string;
    icon: React.ReactNode;
  }[];
  handleOpenNewFolderModal?: () => void;
};

const SideBarButtonsComponent = ({ items }: SideBarButtonsComponentProps) => {
  const location = useLocation();
  const pathname = location.pathname;
  const { data: userCredits } = useGetUserCredits();
  const isMobile = useIsMobile();

  return (
    <Sidebar collapsible={isMobile ? "icon" : "none"} className="border-none">
      <SidebarContent className="pr-6">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item, index) => (
                <SidebarMenuItem key={index}>
                  <CustomLink to={item.href!}>
                    <SidebarMenuButton
                      size="md"
                      isActive={
                        item.href ? pathname.endsWith(item.href) : false
                      }
                      data-testid={`sidebar-nav-${item.title}`}
                      tooltip={item.title}
                    >
                      {item.icon}
                      <span className="block max-w-full truncate">
                        {item.title}
                      </span>
                    </SidebarMenuButton>
                  </CustomLink>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      {userCredits && (
        <SidebarFooter className="border-t p-3">
          <CustomLink to="/settings/credits">
            <div className="flex flex-col gap-1 text-sm text-muted-foreground hover:text-primary cursor-pointer">
              <div className="flex items-center gap-2">
                <ForwardedIconComponent
                  name="Coins"
                  className="h-4 w-4 text-primary"
                />
                <span className="font-medium">Balance: {userCredits.currentBalance}</span>
              </div>
              <div className="flex items-center gap-2 pl-6">
                <span className="text-xs">Used: {userCredits.totalCreditsUsed || 0}</span>
              </div>
            </div>
          </CustomLink>
        </SidebarFooter>
      )}
    </Sidebar>
  );
};

export default SideBarButtonsComponent;
