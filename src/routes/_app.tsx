import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar, items } from "@/components/AppSidebar";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  const currentPath = useRouterState({ select: (r) => r.location.pathname });
  const currentItem = items.find((i) => i.url === currentPath);
  const pageTitle = currentItem?.title ?? "Lakehouse Control";

  return (
    <SidebarProvider>
      <div className="dark min-h-screen flex w-full bg-background text-foreground">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-11 flex items-center gap-2 border-b border-border px-2 bg-card/30">
            <SidebarTrigger />
            <span className="text-xs text-muted-foreground">{pageTitle}</span>
          </header>
          <main className="flex-1 min-h-0">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
