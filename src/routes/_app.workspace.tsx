import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/workspace")({
  component: () => (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      Workspace — em breve
    </div>
  ),
});
