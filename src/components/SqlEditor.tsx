import { useState } from "react";
import Editor from "@monaco-editor/react";
import { Play, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CatalogExplorer, type ExplorerSelection } from "./CatalogExplorer";

const DEFAULT_SQL = `-- Escreva sua consulta SQL
SELECT
  customer_id,
  total_spent,
  last_order_at
FROM analytics_prod.sales.customers
WHERE total_spent > 1000
ORDER BY total_spent DESC
LIMIT 50;`;

const SAMPLE_RESULT = {
  columns: ["customer_id", "total_spent", "last_order_at"],
  rows: [
    ["c_10293", "12480.50", "2025-05-14 09:12:03"],
    ["c_88121", "9320.00", "2025-05-13 17:45:21"],
    ["c_77450", "7811.75", "2025-05-12 11:02:55"],
    ["c_22019", "6540.20", "2025-05-11 08:30:11"],
    ["c_31288", "5102.40", "2025-05-10 22:18:47"],
  ],
};

export function SqlEditor() {
  const [selection, setSelection] = useState<ExplorerSelection>(null);
  const [sql, setSql] = useState(DEFAULT_SQL);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<typeof SAMPLE_RESULT | null>(SAMPLE_RESULT);
  const [elapsed, setElapsed] = useState<number | null>(38);

  const run = () => {
    setRunning(true);
    setResult(null);
    const t0 = performance.now();
    setTimeout(() => {
      setResult(SAMPLE_RESULT);
      setElapsed(Math.round(performance.now() - t0));
      setRunning(false);
    }, 600);
  };

  return (
    <div className="flex h-full text-[14px]">
      <CatalogExplorer selection={selection} onSelect={setSelection} />

      <section className="flex-1 flex flex-col min-w-0">
        {/* Top: SQL editor (40%) */}
        <div className="basis-2/5 grow-0 shrink-0 flex flex-col border-b border-border min-h-0">
          <div className="px-4 h-10 flex items-center justify-between border-b border-border bg-card/30">
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Editor SQL
              </span>
              {selection && "catalog" in selection && (
                <span className="text-xs text-muted-foreground">
                  · {selection.catalog}
                  {"schema" in selection && selection.schema ? ` / ${selection.schema}` : ""}
                </span>
              )}
            </div>
            <Button size="sm" onClick={run} disabled={running} className="h-7 gap-1.5 text-xs">
              {running ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <Play className="h-3.5 w-3.5" />
              )}
              Executar
            </Button>
          </div>
          <div className="flex-1 min-h-0">
            <Editor
              height="100%"
              defaultLanguage="sql"
              theme="vs-dark"
              value={sql}
              onChange={(v) => setSql(v ?? "")}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                scrollBeyondLastLine: false,
                lineNumbersMinChars: 3,
                padding: { top: 10 },
                fontFamily:
                  "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
              }}
            />
          </div>
        </div>

        {/* Bottom: results (60%) */}
        <div className="basis-3/5 grow-0 shrink-0 flex flex-col min-h-0">
          <div className="px-4 h-10 flex items-center justify-between border-b border-border bg-card/30">
            <span className="text-xs uppercase tracking-wider text-muted-foreground">
              Resultado
            </span>
            <span className="text-xs text-muted-foreground">
              {running
                ? "Executando..."
                : result
                  ? `${result.rows.length} linha(s) · ${elapsed}ms`
                  : "—"}
            </span>
          </div>
          <div className="flex-1 overflow-auto">
            {running ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm gap-2">
                <Loader2 className="h-4 w-4 animate-spin" /> Executando consulta...
              </div>
            ) : !result ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">
                Nenhum resultado.
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    {result.columns.map((c) => (
                      <TableHead key={c} className="text-[14px] font-medium">
                        {c}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {result.rows.map((row, i) => (
                    <TableRow key={i}>
                      {row.map((cell, j) => (
                        <TableCell key={j} className="text-[14px] font-mono">
                          {cell}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
