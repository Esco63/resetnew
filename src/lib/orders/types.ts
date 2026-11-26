export const ORDER_STATUSES = ["neu", "erledigt", "gesendet", "storniert"] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  neu: "Neu",
  erledigt: "Erledigt – Rechnung offen",
  gesendet: "Rechnung gesendet",
  storniert: "Storniert",
};

export type Order = {
  id: string;
  created_at: string;
  updated_at: string;
  status: OrderStatus;
  source: "mail" | "manuell";
  mail_message_id: string | null;
  mail_from: string | null;
  mail_subject: string | null;
  mail_received_at: string | null;
  mail_text: string | null;
  order_mail_path: string | null;
  object_address: string;
  task: string | null;
  recipient_email: string | null;
  work_date: string | null;
  hours: number | null;
  sas_gross: number | null;
  disposal_net: number | null;
  sas_receipt_path: string | null;
  lexware_invoice_id: string | null;
  invoice_number: string | null;
  invoice_pdf_path: string | null;
  sent_at: string | null;
  notes: string | null;
};

export const ORDER_FILE_KINDS = ["auftragsmail", "sas", "rechnung"] as const;
export type OrderFileKind = (typeof ORDER_FILE_KINDS)[number];

export const ORDER_FILE_COLUMNS: Record<OrderFileKind, keyof Order> = {
  auftragsmail: "order_mail_path",
  sas: "sas_receipt_path",
  rechnung: "invoice_pdf_path",
};

/** Felder, die im Adminbereich bearbeitet werden dürfen. */
export const EDITABLE_ORDER_FIELDS = [
  "status",
  "object_address",
  "task",
  "recipient_email",
  "work_date",
  "hours",
  "sas_gross",
  "disposal_net",
  "notes",
] as const;
export type EditableOrderField = (typeof EDITABLE_ORDER_FIELDS)[number];

export const ORDERS_BUCKET = "orders";
