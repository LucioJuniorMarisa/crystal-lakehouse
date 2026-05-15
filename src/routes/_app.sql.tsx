import { createFileRoute } from "@tanstack/react-router";
import { SqlEditor } from "@/components/SqlEditor";

export const Route = createFileRoute("/_app/sql")({
  component: SqlEditor,
});
