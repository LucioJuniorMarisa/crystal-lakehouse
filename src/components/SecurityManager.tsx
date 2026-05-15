import { useMemo, useState } from "react";
import { Plus, Shield, UserPlus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { initialCatalogs } from "@/lib/catalog-data";
import { cn } from "@/lib/utils";

type RoleType = "Reader" | "Engineer" | "Admin";
interface UserRole {
  id: string;
  catalog: string;
  schema: string;
  role: RoleType;
}
interface AppUser {
  id: string;
  username: string;
  name: string;
  createdAt: string;
  position: string;
  roles: UserRole[];
}

const AVAILABLE_USERS: Omit<AppUser, "roles">[] = [
  { id: "u1", username: "ana.silva", name: "Ana Silva", createdAt: "2025-01-12", position: "Data Engineer" },
  { id: "u2", username: "bruno.costa", name: "Bruno Costa", createdAt: "2025-02-03", position: "Analytics Lead" },
  { id: "u3", username: "carla.mendes", name: "Carla Mendes", createdAt: "2025-02-21", position: "Data Scientist" },
  { id: "u4", username: "diego.rocha", name: "Diego Rocha", createdAt: "2025-03-08", position: "Platform Admin" },
  { id: "u5", username: "eduarda.luz", name: "Eduarda Luz", createdAt: "2025-03-19", position: "BI Analyst" },
  { id: "u6", username: "felipe.araujo", name: "Felipe Araújo", createdAt: "2025-04-02", position: "ML Engineer" },
  { id: "u7", username: "gabriela.lima", name: "Gabriela Lima", createdAt: "2025-04-15", position: "Data Steward" },
  { id: "u8", username: "henrique.dias", name: "Henrique Dias", createdAt: "2025-04-28", position: "Backend Engineer" },
];

const ROLE_TYPES: RoleType[] = ["Reader", "Engineer", "Admin"];

const roleColor: Record<RoleType, string> = {
  Reader: "bg-primary/15 text-primary border-primary/30",
  Engineer: "bg-accent text-accent-foreground border-border",
  Admin: "bg-destructive/15 text-destructive border-destructive/30",
};

export function SecurityManager() {
  const [users, setUsers] = useState<AppUser[]>([
    { ...AVAILABLE_USERS[0], roles: [
      { id: "r1", catalog: "analytics_prod", schema: "core", role: "Engineer" },
    ] },
    { ...AVAILABLE_USERS[3], roles: [
      { id: "r2", catalog: "analytics_prod", schema: "core", role: "Admin" },
      { id: "r3", catalog: "marketing", schema: "campaigns", role: "Admin" },
    ] },
    { ...AVAILABLE_USERS[4], roles: [
      { id: "r4", catalog: "marketing", schema: "campaigns", role: "Reader" },
    ] },
  ]);

  const [addOpen, setAddOpen] = useState(false);
  const [pickedIds, setPickedIds] = useState<string[]>([]);

  const [roleOpen, setRoleOpen] = useState(false);
  const [roleCatalog, setRoleCatalog] = useState(initialCatalogs[0]?.name ?? "");
  const [roleSchema, setRoleSchema] = useState(initialCatalogs[0]?.schemas[0]?.name ?? "");
  const [roleType, setRoleType] = useState<RoleType>("Reader");

  const [editingUser, setEditingUser] = useState<AppUser | null>(null);

  const existingIds = useMemo(() => new Set(users.map((u) => u.id)), [users]);
  const selectableUsers = AVAILABLE_USERS.filter((u) => !existingIds.has(u.id));

  const togglePick = (id: string) =>
    setPickedIds((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const confirmAdd = () => {
    const toAdd = AVAILABLE_USERS.filter((u) => pickedIds.includes(u.id)).map(
      (u) => ({ ...u, roles: [] })
    );
    setUsers((prev) => [...prev, ...toAdd]);
    setPickedIds([]);
    setAddOpen(false);
  };

  const schemasOf = (cat: string) =>
    initialCatalogs.find((c) => c.name === cat)?.schemas ?? [];

  const createRoleTemplate = () => {
    // Apply this role to currently selected user if a modal is open, otherwise just close.
    if (editingUser) {
      const newRole: UserRole = {
        id: crypto.randomUUID(),
        catalog: roleCatalog,
        schema: roleSchema,
        role: roleType,
      };
      const updated = { ...editingUser, roles: [...editingUser.roles, newRole] };
      setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
      setEditingUser(updated);
    }
    setRoleOpen(false);
  };

  const removeRole = (roleId: string) => {
    if (!editingUser) return;
    const updated = {
      ...editingUser,
      roles: editingUser.roles.filter((r) => r.id !== roleId),
    };
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(updated);
  };

  const addRoleToEditing = () => {
    if (!editingUser) return;
    const newRole: UserRole = {
      id: crypto.randomUUID(),
      catalog: roleCatalog,
      schema: roleSchema,
      role: roleType,
    };
    const updated = { ...editingUser, roles: [...editingUser.roles, newRole] };
    setUsers((prev) => prev.map((u) => (u.id === updated.id ? updated : u)));
    setEditingUser(updated);
  };

  return (
    <div className="h-full flex flex-col p-6 gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-semibold">Segurança</h1>
          <p className="text-xs text-muted-foreground">
            Gerencie usuários e permissões do lakehouse.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5"
            onClick={() => setAddOpen(true)}
          >
            <UserPlus className="h-4 w-4" />
            Adicionar Usuários
          </Button>
          <Button
            size="sm"
            className="gap-1.5"
            onClick={() => {
              setRoleCatalog(initialCatalogs[0]?.name ?? "");
              setRoleSchema(initialCatalogs[0]?.schemas[0]?.name ?? "");
              setRoleType("Reader");
              setRoleOpen(true);
            }}
          >
            <Shield className="h-4 w-4" />
            Criar Roles
          </Button>
        </div>
      </div>

      <div className="flex-1 min-h-0 rounded-md border border-border bg-card/40 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="text-[14px]">Usuário</TableHead>
              <TableHead className="text-[14px]">Nome</TableHead>
              <TableHead className="text-[14px]">Criado em</TableHead>
              <TableHead className="text-[14px]">Cargo</TableHead>
              <TableHead className="text-[14px]">Roles</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.map((u) => (
              <TableRow
                key={u.id}
                onClick={() => setEditingUser(u)}
                className="cursor-pointer"
              >
                <TableCell className="text-[14px] font-medium text-primary">
                  {u.username}
                </TableCell>
                <TableCell className="text-[14px]">{u.name}</TableCell>
                <TableCell className="text-[14px] text-muted-foreground">
                  {u.createdAt}
                </TableCell>
                <TableCell className="text-[14px]">{u.position}</TableCell>
                <TableCell className="text-[14px] text-muted-foreground">
                  {u.roles.length}
                </TableCell>
              </TableRow>
            ))}
            {users.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-10 text-sm">
                  Nenhum usuário adicionado.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add users modal */}
      <Dialog open={addOpen} onOpenChange={setAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Usuários</DialogTitle>
            <DialogDescription>
              Selecione um ou mais usuários para conceder acesso.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-80 overflow-auto divide-y divide-border border border-border rounded-md">
            {selectableUsers.length === 0 && (
              <div className="p-4 text-sm text-muted-foreground text-center">
                Todos os usuários disponíveis já foram adicionados.
              </div>
            )}
            {selectableUsers.map((u) => {
              const checked = pickedIds.includes(u.id);
              return (
                <label
                  key={u.id}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-accent/40",
                    checked && "bg-accent/60"
                  )}
                >
                  <Checkbox checked={checked} onCheckedChange={() => togglePick(u.id)} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-medium">{u.username}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {u.name} • {u.position}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => { setAddOpen(false); setPickedIds([]); }}>
              Cancelar
            </Button>
            <Button onClick={confirmAdd} disabled={pickedIds.length === 0}>
              Adicionar ({pickedIds.length})
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create role modal */}
      <Dialog open={roleOpen} onOpenChange={setRoleOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Criar Role</DialogTitle>
            <DialogDescription>
              Defina catálogo, schema e tipo de permissão.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-1">
            <div className="space-y-1.5">
              <Label className="text-[14px]">Catálogo</Label>
              <select
                value={roleCatalog}
                onChange={(e) => {
                  setRoleCatalog(e.target.value);
                  const first = initialCatalogs.find((c) => c.name === e.target.value)?.schemas[0]?.name ?? "";
                  setRoleSchema(first);
                }}
                className="w-full h-9 rounded-md bg-input border border-border px-3 text-[14px]"
              >
                {initialCatalogs.map((c) => (
                  <option key={c.name} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[14px]">Schema</Label>
              <select
                value={roleSchema}
                onChange={(e) => setRoleSchema(e.target.value)}
                className="w-full h-9 rounded-md bg-input border border-border px-3 text-[14px]"
              >
                {schemasOf(roleCatalog).map((s) => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-[14px]">Tipo</Label>
              <div className="grid grid-cols-3 gap-2">
                {ROLE_TYPES.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRoleType(r)}
                    className={cn(
                      "h-9 rounded-md border text-[14px] transition-colors",
                      roleType === r
                        ? "border-primary bg-primary/15 text-primary"
                        : "border-border bg-card hover:bg-accent/50"
                    )}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setRoleOpen(false)}>Cancelar</Button>
            <Button onClick={createRoleTemplate}>
              {editingUser ? "Adicionar ao usuário" : "Criar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit user roles modal */}
      <Dialog open={editingUser !== null} onOpenChange={(o) => !o && setEditingUser(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingUser?.username}</DialogTitle>
            <DialogDescription>
              Gerencie as roles atribuídas a {editingUser?.name}.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Roles atuais
              </div>
              <div className="space-y-1.5 max-h-52 overflow-auto">
                {editingUser?.roles.length === 0 && (
                  <div className="text-sm text-muted-foreground py-4 text-center border border-dashed border-border rounded-md">
                    Nenhuma role atribuída.
                  </div>
                )}
                {editingUser?.roles.map((r) => (
                  <div
                    key={r.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 border border-border rounded-md bg-card/40"
                  >
                    <div className="flex items-center gap-2 min-w-0 text-[14px]">
                      <Badge variant="outline" className={cn("border", roleColor[r.role])}>
                        {r.role}
                      </Badge>
                      <span className="truncate">
                        {r.catalog}.<span className="text-muted-foreground">{r.schema}</span>
                      </span>
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7"
                      onClick={() => removeRole(r.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-3">
              <div className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
                Adicionar nova role
              </div>
              <div className="grid grid-cols-3 gap-2">
                <select
                  value={roleCatalog}
                  onChange={(e) => {
                    setRoleCatalog(e.target.value);
                    const first = initialCatalogs.find((c) => c.name === e.target.value)?.schemas[0]?.name ?? "";
                    setRoleSchema(first);
                  }}
                  className="h-9 rounded-md bg-input border border-border px-2 text-[14px]"
                >
                  {initialCatalogs.map((c) => (
                    <option key={c.name} value={c.name}>{c.name}</option>
                  ))}
                </select>
                <select
                  value={roleSchema}
                  onChange={(e) => setRoleSchema(e.target.value)}
                  className="h-9 rounded-md bg-input border border-border px-2 text-[14px]"
                >
                  {schemasOf(roleCatalog).map((s) => (
                    <option key={s.name} value={s.name}>{s.name}</option>
                  ))}
                </select>
                <select
                  value={roleType}
                  onChange={(e) => setRoleType(e.target.value as RoleType)}
                  className="h-9 rounded-md bg-input border border-border px-2 text-[14px]"
                >
                  {ROLE_TYPES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
              <Button size="sm" variant="secondary" className="mt-2 gap-1.5" onClick={addRoleToEditing}>
                <Plus className="h-4 w-4" /> Adicionar role
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button onClick={() => setEditingUser(null)}>Concluído</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
