import { createFileRoute } from "@tanstack/react-router";

function Placeholder({ title }: { title: string }) {
  return (
    <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
      {title} — em breve
    </div>
  );
}

export const Route = createFileRoute("/_app/sql")({
  component: () => <Placeholder title="Editor SQL" />,
});
