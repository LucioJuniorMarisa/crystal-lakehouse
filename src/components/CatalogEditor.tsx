import { useMemo, useState } from "react";
import { ChevronRight, Database, Folder, Table2, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { initialCatalogs, type Catalog, type TableMeta } from "@/lib/catalog-data";

type Selection =
  | { type: "catalog"; catalog: string }
  | { type: "schema"; catalog: string; schema: string }
  | { type: "table"; catalog: string; schema: string; table: string }
  | null;

type CreateMode = "catalog" | "schema" | null;

export function CatalogEditor() {
  const [catalogs, setCatalogs] = useState<Catalog[]>(initialCatalogs);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({
    [initialCatalogs[0].name]: true,
  });
  const [selection, setSelection] = useState<Selection>({
    type: "catalog",
    catalog: initialCatalogs[0].name,
  });
  const [createMode, setCreateMode] = useState<CreateMode>(null);
  const [formName, setFormName] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [targetCatalog, setTargetCatalog] = useState<string>(initialCatalogs[0].name);

  const toggle = (key: string) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const listRows: { name: string; createdBy: string; createdAt: string; description: string; kind: string }[] =
    useMemo(() => {
      if (!selection) return [];
      if (selection.type === "catalog") {
        const cat = catalogs.find((c) => c.name === selection.catalog);
        return (
          cat?.schemas.map((s) => ({
            name: s.name,
            createdBy: "—",
            createdAt: "—",
            description: `${s.tables.length} tabela(s)`,
            kind: "schema",
          })) ?? []
        );
      }
      if (selection.type === "schema") {
        const cat = catalogs.find((c) => c.name === selection.catalog);
        const sch = cat?.schemas.find((s) => s.name === selection.schema);
        return (
          sch?.tables.map((t: TableMeta) => ({
            name: t.name,
            createdBy: t.createdBy,
            createdAt: t.createdAt,
            description: t.description,
            kind: "table",
          })) ?? []
        );
      }
      if (selection.type === "table") {
        const cat = catalogs.find((c) => c.name === selection.catalog);
        const sch = cat?.schemas.find((s) => s.name === selection.schema);
        const t = sch?.tables.find((x) => x.name === selection.table);
        return t
          ? [{ name: t.name, createdBy: t.createdBy, createdAt: t.createdAt, description: t.description, kind: "table" }]
          : [];
      }
      return [];
    }, [selection, catalogs]);

  const breadcrumb = useMemo(() => {
    if (!selection) return "Selecione um item";
    if (selection.type === "catalog") return selection.catalog;
    if (selection.type === "schema") return `${selection.catalog} / ${selection.schema}`;
    return `${selection.catalog} / ${selection.schema} / ${selection.table}`;
  }, [selection]);

  const openCreate = (mode: "catalog" | "schema") => {
    setCreateMode(mode);
    setFormName("");
    setFormDesc("");
    if (mode === "schema") {
      setTargetCatalog(
        selection && "catalog" in selection ? selection.catalog : catalogs[0]?.name ?? ""
      );
    }
  };

  const submitCreate = () => {
    if (!formName.trim()) return;
    if (createMode === "catalog") {
      setCatalogs((prev) => [
        ...prev,
        { name: formName.trim(), description: formDesc.trim(), schemas: [] },
      ]);
    } else if (createMode === "schema") {
      setCatalogs((prev) =>
        prev.map((c) =>
          c.name === targetCatalog
            ? { ...c, schemas: [...c.schemas, { name: formName.trim(), tables: [] }] }
            : c
        )
      );
      setExpanded((p) => ({ ...p, [targetCatalog]: true }));
    }
    setCreateMode(null);
  };

  return (
    <div className="flex h-full text-[14px]">
      {/* Object explorer (1/4) */}
      <aside className="w-1/4 min-w-[260px] border-r border-border bg-card/40 flex flex-col">
        <div className="p-3 border-b border-border flex items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">
            Object Explorer
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" variant="secondary" className="h-7 gap-1 text-xs">
                <Plus className="h-3.5 w-3.5" />
                Criar
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => openCreate("catalog")}>
                <Database className="h-4 w-4 mr-2" /> Criar Catálogo
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openCreate("schema")}>
                <Folder className="h-4 w-4 mr-2" /> Criar Schema
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex-1 overflow-auto py-2">
          {catalogs.map((cat) => {
            const isCatOpen = !!expanded[cat.name];
            const catSelected =
              selection?.type === "catalog" && selection.catalog === cat.name;
            return (
              <div key={cat.name} className="select-none">
                <button
                  onClick={() => {
                    toggle(cat.name);
                    setSelection({ type: "catalog", catalog: cat.name });
                  }}
                  className={cn(
                    "w-full flex items-center gap-1.5 px-2 py-1.5 text-[14px] hover:bg-accent/50 rounded-sm",
                    catSelected && "bg-accent text-accent-foreground"
                  )}
                >
                  <ChevronRight
                    className={cn("h-3.5 w-3.5 transition-transform", isCatOpen && "rotate-90")}
                  />
                  <Database className="h-[18px] w-[18px] text-primary" />
                  <span className="font-medium">{cat.name}</span>
                </button>

                {isCatOpen &&
                  cat.schemas.map((sch) => {
                    const schKey = `${cat.name}.${sch.name}`;
                    const isSchOpen = !!expanded[schKey];
                    const schSelected =
                      selection?.type === "schema" &&
                      selection.catalog === cat.name &&
                      selection.schema === sch.name;
                    return (
                      <div key={schKey}>
                        <button
                          onClick={() => {
                            toggle(schKey);
                            setSelection({
                              type: "schema",
                              catalog: cat.name,
                              schema: sch.name,
                            });
                          }}
                          className={cn(
                            "w-full flex items-center gap-1.5 pl-7 pr-2 py-1.5 text-[14px] hover:bg-accent/50 rounded-sm",
                            schSelected && "bg-accent text-accent-foreground"
                          )}
                        >
                          <ChevronRight
                            className={cn(
                              "h-3.5 w-3.5 transition-transform",
                              isSchOpen && "rotate-90"
                            )}
                          />
                          <Folder className="h-4 w-4 text-primary/80" />
                          <span>{sch.name}</span>
                        </button>

                        {isSchOpen &&
                          sch.tables.map((t) => {
                            const tSelected =
                              selection?.type === "table" &&
                              selection.catalog === cat.name &&
                              selection.schema === sch.name &&
                              selection.table === t.name;
                            return (
                              <button
                                key={t.name}
                                onClick={() =>
                                  setSelection({
                                    type: "table",
                                    catalog: cat.name,
                                    schema: sch.name,
                                    table: t.name,
                                  })
                                }
                                className={cn(
                                  "w-full flex items-center gap-1.5 pl-[3.25rem] pr-2 py-1.5 text-[14px] hover:bg-accent/50 rounded-sm text-left",
                                  tSelected && "bg-accent text-accent-foreground"
                                )}
                              >
                                <Table2 className="h-3.5 w-3.5 text-muted-foreground" />
                                <span>{t.name}</span>
                              </button>
                            );
                          })}
                      </div>
                    );
                  })}
              </div>
            );
          })}
        </div>
      </aside>

      {/* List container */}
      <section className="flex-1 flex flex-col min-w-0">
        <div className="px-5 py-3 border-b border-border flex items-baseline justify-between">
          <div>
            <h1 className="text-base font-semibold">Editor de Catálogo</h1>
            <p className="text-xs text-muted-foreground mt-0.5">{breadcrumb}</p>
          </div>
          <span className="text-xs text-muted-foreground">
            {listRows.length} item(s)
          </span>
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-[14px]">Nome da tabela</TableHead>
                <TableHead className="text-[14px]">Criado por</TableHead>
                <TableHead className="text-[14px]">Criado em</TableHead>
                <TableHead className="text-[14px]">Descrição</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {listRows.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-10 text-[14px]">
                    Nenhum item para exibir.
                  </TableCell>
                </TableRow>
              ) : (
                listRows.map((r) => (
                  <TableRow key={r.name}>
                    <TableCell className="text-[14px] font-medium">
                      <span className="inline-flex items-center gap-2">
                        {r.kind === "schema" ? (
                          <Folder className="h-4 w-4 text-primary/80" />
                        ) : (
                          <Table2 className="h-4 w-4 text-muted-foreground" />
                        )}
                        {r.name}
                      </span>
                    </TableCell>
                    <TableCell className="text-[14px]">{r.createdBy}</TableCell>
                    <TableCell className="text-[14px]">{r.createdAt}</TableCell>
                    <TableCell className="text-[14px] text-muted-foreground">
                      {r.description}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </section>

      {/* Create dialog */}
      <Dialog open={createMode !== null} onOpenChange={(o) => !o && setCreateMode(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {createMode === "catalog" ? "Criar Catálogo" : "Criar Schema"}
            </DialogTitle>
            <DialogDescription>
              {createMode === "catalog"
                ? "Defina um novo catálogo no lakehouse."
                : "Adicione um schema dentro do catálogo selecionado."}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            {createMode === "schema" && (
              <div className="space-y-1.5">
                <Label className="text-[14px]">Catálogo</Label>
                <select
                  value={targetCatalog}
                  onChange={(e) => setTargetCatalog(e.target.value)}
                  className="w-full h-9 rounded-md bg-input border border-border px-3 text-[14px]"
                >
                  {catalogs.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-[14px]">
                Nome
              </Label>
              <Input
                id="name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder={createMode === "catalog" ? "ex: analytics_dev" : "ex: finance"}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc" className="text-[14px]">
                Descrição
              </Label>
              <Textarea
                id="desc"
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Descreva a finalidade..."
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateMode(null)}>
              Cancelar
            </Button>
            <Button onClick={submitCreate} disabled={!formName.trim()}>
              Criar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
