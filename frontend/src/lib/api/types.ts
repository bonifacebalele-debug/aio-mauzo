export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface ApiResponse<T> {
  data: T;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  signature_url: string | null;
  is_active: boolean;
  last_login_at: string | null;
  roles: string[];
  permissions: string[];
}

export interface UserPayload {
  name: string;
  email: string;
  phone?: string;
  password?: string;
  role: string;
  is_active?: boolean;
}

export interface Customer {
  id: number;
  company_name: string;
  contact_person: string | null;
  phone: string | null;
  email: string | null;
  tin: string | null;
  vrn: string | null;
  physical_address: string | null;
  postal_address: string | null;
  country: string | null;
  city: string | null;
  notes: string | null;
  is_active: boolean;
  invoices_count?: number;
  created_at: string;
  updated_at: string;
}

export type CustomerPayload = Omit<
  Customer,
  "id" | "invoices_count" | "created_at" | "updated_at"
>;

export interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  exchange_rate: number;
  is_default: boolean;
}

export interface Tax {
  id: number;
  name: string;
  rate: number;
  is_default: boolean;
}

export type InvoiceStatus = "draft" | "sent" | "viewed" | "paid" | "cancelled" | "overdue";

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_type: "percent" | "fixed";
  discount_value: number;
  tax_id: number | null;
  tax_rate: number;
  subtotal: number;
  discount_amount: number;
  tax_amount: number;
  total: number;
  sort_order: number;
}

export interface InvoiceItemPayload {
  description: string;
  quantity: number;
  unit: string;
  unit_price: number;
  discount_type: "percent" | "fixed";
  discount_value: number;
  tax_id: number | null;
  tax_rate: number;
}

export interface Invoice {
  id: number;
  invoice_number: string;
  reference: string | null;
  invoice_date: string;
  due_date: string | null;
  status: InvoiceStatus;
  status_label: string;
  subtotal: number;
  discount_total: number;
  tax_total: number;
  grand_total: number;
  amount_paid: number;
  outstanding_balance: number;
  notes: string | null;
  terms: string | null;
  pdf_url: string | null;
  pdf_generated_at: string | null;
  sent_at: string | null;
  viewed_at: string | null;
  paid_at: string | null;
  creator_signature_url: string | null;
  customer: Customer;
  currency: Currency;
  items: InvoiceItem[];
  created_at: string;
  updated_at: string;
}

export interface InvoicePayload {
  customer_id: number;
  currency_id: number;
  reference?: string | null;
  invoice_date: string;
  due_date?: string | null;
  notes?: string | null;
  terms?: string | null;
  items: InvoiceItemPayload[];
}

export interface DashboardStats {
  todays_sales: number;
  revenue: number;
  outstanding_balance: number;
  customers_count: number;
  invoices: {
    total: number;
    draft: number;
    sent: number;
    viewed: number;
    paid: number;
    pending: number;
    overdue: number;
    cancelled: number;
  };
}

export interface ChartPoint {
  label: string;
  value: number;
}

export interface LatestPayment {
  id: number;
  amount: number;
  payment_date: string;
  payment_method: string | null;
  invoice_number: string | null;
  customer_name: string | null;
}

export interface TopCustomer {
  id: number;
  company_name: string;
  total_invoiced: number;
}

export interface ActivityEntry {
  id: number;
  action: string;
  description: string | null;
  user_name: string | null;
  created_at: string;
}

export type ReportType = "sales" | "vat" | "customers" | "outstanding" | "payments";

export interface ReportRow {
  [key: string]: string | number | null;
}

export interface ReportResponse {
  data: ReportRow[];
  meta: {
    title: string;
    headings: string[];
    count: number;
  };
}

export interface PeriodSummaryPoint {
  period: string;
  invoice_count: number;
  total_invoiced: number;
  total_paid: number;
}

export interface StatementEntry {
  date: string;
  type: "invoice" | "payment";
  reference: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

export interface CustomerStatement {
  customer: { id: number; company_name: string; email: string | null; phone: string | null; tin: string | null };
  from: string | null;
  to: string | null;
  entries: StatementEntry[];
  summary: {
    total_invoiced: number;
    total_paid: number;
    closing_balance: number;
  };
}

export interface ActivityLogEntry {
  id: number;
  action: string;
  description: string | null;
  subject_type: string | null;
  subject_id: number | null;
  user_name: string;
  ip_address: string | null;
  created_at: string;
}

export interface EmailLog {
  id: number;
  to_email: string;
  subject: string;
  status: "queued" | "sent" | "failed";
  provider_response: string | null;
  sent_at: string | null;
  created_at: string;
}

export interface SendInvoiceEmailPayload {
  to_email: string;
  subject: string;
  message: string;
}

export interface CompanyBankAccount {
  id: number;
  type: "bank" | "mobile_money";
  label: string;
  account_name: string | null;
  account_number: string | null;
}

export interface Company {
  id: number;
  name: string;
  logo_url: string | null;
  logo_size: string;
  logo_position: string;
  primary_color: string;
  secondary_color: string;
  signature_url: string | null;
  signature_enabled: boolean;
  signature_width: number;
  signature_x: number;
  signature_y: number;
  stamp_url: string | null;
  stamp_enabled: boolean;
  stamp_width: number;
  stamp_rotation: number;
  stamp_opacity: number;
  stamp_x: number;
  stamp_y: number;
  address: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  tin: string | null;
  vrn: string | null;
  business_registration_number: string | null;
  footer_text: string | null;
  terms_conditions: string | null;
  payment_instructions: string | null;
  default_currency: Currency | null;
  default_language: string;
  invoice_prefix: string;
  invoice_number_format: string;
  bank_accounts?: CompanyBankAccount[];
}
