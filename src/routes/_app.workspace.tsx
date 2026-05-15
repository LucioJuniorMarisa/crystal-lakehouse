import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceBrowser } from "@/components/WorkspaceBrowser";

export const Route = createFileRoute("/_app/workspace")({
  component: WorkspaceBrowser,
});
