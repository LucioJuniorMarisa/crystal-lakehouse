import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/security")({
  component: () => (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      Segurança — em breve
    </div>
  ),
});
