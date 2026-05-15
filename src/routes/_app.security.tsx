import { createFileRoute } from "@tanstack/react-router";
import { SecurityManager } from "@/components/SecurityManager";

export const Route = createFileRoute("/_app/security")({
  component: SecurityManager,
});
