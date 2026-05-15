export type TableMeta = {
  name: string;
  createdBy: string;
  createdAt: string;
  description: string;
};

export type Schema = {
  name: string;
  tables: TableMeta[];
};

export type Catalog = {
  name: string;
  description: string;
  schemas: Schema[];
};

export const initialCatalogs: Catalog[] = [
  {
    name: "analytics_prod",
    description: "Catálogo de produção para analytics",
    schemas: [
      {
        name: "sales",
        tables: [
          { name: "orders", createdBy: "ana.silva", createdAt: "2025-03-12", description: "Pedidos consolidados" },
          { name: "order_items", createdBy: "ana.silva", createdAt: "2025-03-12", description: "Itens por pedido" },
          { name: "customers", createdBy: "joao.lima", createdAt: "2025-02-28", description: "Cadastro de clientes" },
        ],
      },
      {
        name: "marketing",
        tables: [
          { name: "campaigns", createdBy: "marina.r", createdAt: "2025-04-02", description: "Campanhas ativas" },
          { name: "leads", createdBy: "marina.r", createdAt: "2025-04-05", description: "Leads capturados" },
        ],
      },
    ],
  },
  {
    name: "raw_lake",
    description: "Camada bronze de dados brutos",
    schemas: [
      {
        name: "ingest",
        tables: [
          { name: "events_raw", createdBy: "pipeline", createdAt: "2025-05-01", description: "Eventos crus do Kafka" },
          { name: "logs_raw", createdBy: "pipeline", createdAt: "2025-05-01", description: "Logs aplicação" },
        ],
      },
    ],
  },
  {
    name: "sandbox",
    description: "Espaço de experimentação",
    schemas: [
      {
        name: "ds_team",
        tables: [
          { name: "feature_store_v1", createdBy: "lucas.p", createdAt: "2025-04-22", description: "Features ML" },
        ],
      },
    ],
  },
];
