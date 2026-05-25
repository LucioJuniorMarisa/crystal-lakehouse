import { Link, useRouterState } from "@tanstack/react-router";
import { Database, Code2, Shield, LayoutGrid } from "lucide-react";
import heathhubLogo from "@/assets/heathhub-logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar";

const items = [
  { title: "Editor de Catálogo", url: "/", icon: Database },
  { title: "Editor SQL", url: "/sql", icon: Code2 },
  { title: "Segurança", url: "/security", icon: Shield },
  { title: "Workspace", url: "/workspace", icon: LayoutGrid },
];

export function AppSidebar() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center justify-center px-2 py-4 group-data-[collapsible=icon]:px-1 group-data-[collapsible=icon]:py-2">
          <img
            src={heathhubLogo}
            alt="HeathHUB"
            className="h-40 w-auto object-contain group-data-[collapsible=icon]:h-[120px]"
          />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => {
                const active = currentPath === item.url;
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild isActive={active} tooltip={item.title}>
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
