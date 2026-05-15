import { useState } from "react";
import {
  ChevronRight,
  Folder,
  FolderOpen,
  File,
  FileText,
  FileCode,
  FileSpreadsheet,
  FileImage,
  Home,
  Upload,
  FolderPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

type Node =
  | { type: "folder"; name: string; modified: string; children: Node[] }
  | { type: "file"; name: string; modified: string; size: string };

const initialTree: Node[] = [
  {
    type: "folder",
    name: "notebooks",
    modified: "2025-05-10",
    children: [
      { type: "file", name: "exploration.ipynb", modified: "2025-05-10", size: "82 KB" },
      { type: "file", name: "feature_engineering.ipynb", modified: "2025-04-22", size: "120 KB" },
      {
        type: "folder",
        name: "archive",
        modified: "2025-03-12",
        children: [
          { type: "file", name: "v1_model.ipynb", modified: "2025-02-01", size: "64 KB" },
        ],
      },
    ],
  },
  {
    type: "folder",
    name: "queries",
    modified: "2025-05-09",
    children: [
      { type: "file", name: "daily_revenue.sql", modified: "2025-05-09", size: "2 KB" },
      { type: "file", name: "active_users.sql", modified: "2025-05-08", size: "1 KB" },
      { type: "file", name: "churn_cohort.sql", modified: "2025-05-01", size: "4 KB" },
    ],
  },
  {
    type: "folder",
    name: "datasets",
    modified: "2025-05-12",
    children: [
      { type: "file", name: "customers.csv", modified: "2025-05-12", size: "12 MB" },
      { type: "file", name: "events.parquet", modified: "2025-05-11", size: "248 MB" },
      { type: "file", name: "schema.json", modified: "2025-05-02", size: "6 KB" },
    ],
  },
  {
    type: "folder",
    name: "reports",
    modified: "2025-05-14",
    children: [
      { type: "file", name: "Q2_overview.md", modified: "2025-05-14", size: "18 KB" },
      { type: "file", name: "dashboard_preview.png", modified: "2025-05-13", size: "640 KB" },
    ],
  },
  { type: "file", name: "README.md", modified: "2025-05-15", size: "3 KB" },
  { type: "file", name: ".env.example", modified: "2025-04-01", size: "1 KB" },
];

const fileIcon = (name: string) => {
  const ext = name.split(".").pop()?.toLowerCase();
  if (ext === "sql") return FileCode;
  if (ext === "ipynb" || ext === "json" || ext === "py" || ext === "ts") return FileCode;
  if (ext === "csv" || ext === "parquet" || ext === "xlsx") return FileSpreadsheet;
  if (ext === "png" || ext === "jpg" || ext === "svg") return FileImage;
  if (ext === "md" || ext === "txt") return FileText;
  return File;
};

function findFolder(tree: Node[], path: string[]): Node[] {
  let current = tree;
  for (const seg of path) {
    const next = current.find((n) => n.type === "folder" && n.name === seg);
    if (next && next.type === "folder") current = next.children;
    else return [];
  }
  return current;
}

export function WorkspaceBrowser() {
  const [path, setPath] = useState<string[]>([]);
  const [selected, setSelected] = useState<string | null>(null);

  const items = findFolder(initialTree, path);
  const folders = items.filter((i) => i.type === "folder");
  const files = items.filter((i) => i.type === "file");
  const sorted = [...folders, ...files];

  const enter = (name: string) => {
    setPath((p) => [...p, name]);
    setSelected(null);
  };

  const goTo = (idx: number) => {
    setPath((p) => p.slice(0, idx));
    setSelected(null);
  };

  return (
    <div className="h-full flex flex-col p-6 gap-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h1 className="text-lg font-semibold">Workspace</h1>
          <p className="text-xs text-muted-foreground">
            Navegue pelos arquivos e pastas do seu workspace.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" className="gap-1.5">
            <FolderPlus className="h-4 w-4" /> Nova pasta
          </Button>
          <Button size="sm" className="gap-1.5">
            <Upload className="h-4 w-4" /> Upload
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-md border border-border bg-card/40 flex flex-col">
        <div className="flex items-center gap-1 px-3 py-2 border-b border-border text-[14px]">
          <button
            onClick={() => goTo(0)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
          >
            <Home className="h-3.5 w-3.5" />
            workspace
          </button>
          {path.map((seg, i) => (
            <span key={i} className="flex items-center gap-1">
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
              <button
                onClick={() => goTo(i + 1)}
                className={cn(
                  "hover:text-foreground",
                  i === path.length - 1 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {seg}
              </button>
            </span>
          ))}
        </div>

        <div className="flex-1 overflow-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[14px]">Nome</TableHead>
                <TableHead className="text-[14px] w-40">Modificado</TableHead>
                <TableHead className="text-[14px] w-32 text-right pr-4">Tamanho</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sorted.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} className="text-center text-muted-foreground py-10 text-sm">
                    Pasta vazia.
                  </TableCell>
                </TableRow>
              )}
              {sorted.map((node) => {
                const isFolder = node.type === "folder";
                const Icon = isFolder
                  ? selected === node.name
                    ? FolderOpen
                    : Folder
                  : fileIcon(node.name);
                const isSelected = selected === node.name;
                return (
                  <TableRow
                    key={node.name}
                    onClick={() => setSelected(node.name)}
                    onDoubleClick={() => isFolder && enter(node.name)}
                    className={cn("cursor-pointer", isSelected && "bg-accent/50")}
                  >
                    <TableCell className="text-[14px]">
                      <button
                        onClick={(e) => {
                          if (isFolder) {
                            e.stopPropagation();
                            enter(node.name);
                          }
                        }}
                        className="flex items-center gap-2 text-left"
                      >
                        <Icon
                          className={cn(
                            "h-4 w-4",
                            isFolder ? "text-primary" : "text-muted-foreground"
                          )}
                        />
                        <span className={cn(isFolder && "font-medium")}>{node.name}</span>
                      </button>
                    </TableCell>
                    <TableCell className="text-[14px] text-muted-foreground">
                      {node.modified}
                    </TableCell>
                    <TableCell className="text-[14px] text-muted-foreground text-right pr-4">
                      {isFolder ? "—" : node.size}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>

        <div className="border-t border-border px-3 py-1.5 text-xs text-muted-foreground flex items-center justify-between">
          <span>
            {folders.length} pasta(s) · {files.length} arquivo(s)
          </span>
          {selected && <span>Selecionado: {selected}</span>}
        </div>
      </div>
    </div>
  );
}
