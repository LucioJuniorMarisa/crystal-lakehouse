import { createFileRoute } from "@tanstack/react-router";
import { CatalogEditor } from "@/components/CatalogEditor";

export const Route = createFileRoute("/_app/")({
  head: () => ({
    meta: [
      { title: "Editor de Catálogo — Lakehouse" },
      { name: "description", content: "Explore catálogos, schemas e tabelas do seu lakehouse." },
    ],
  }),
  component: () => <CatalogEditor />,
});
