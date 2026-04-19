export interface LagoConfig {
  baseUrl: string;
  apiKey: string;
}

export interface PaginationParams {
  page?: number;
  per_page?: number;
}

export interface LagoResponse<T> {
  [key: string]: T;
}

export interface LagoPaginatedResponse<T> {
  [key: string]: T[];
  meta?: any;
}

// Customer types
export interface Customer {
  lago_id: string;
  external_id: string;
  name: string;
  email?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  zipcode?: string;
  country?: string;
  phone?: string;
  currency?: string;
  timezone?: string;
  billing_configuration?: BillingConfiguration;
  metadata?: CustomerMetadata[];
  created_at: string;
  updated_at: string;
}

export interface BillingConfiguration {
  invoice_grace_period?: number;
  payment_provider?: string;
  provider_customer_id?: string;
  sync?: boolean;
  sync_with_provider?: boolean;
  document_locale?: string;
}

export interface CustomerMetadata {
  key: string;
  value: string;
  display_in_invoice: boolean;
}

// Subscription types
export interface Subscription {
  lago_id: string;
  external_id: string;
  external_customer_id: string;
  plan_code: string;
  status: string;
  name?: string;
  billing_time?: string;
  subscription_at?: string;
  ending_at?: string;
  created_at: string;
  canceled_at?: string;
  terminated_at?: string;
}

// Invoice types
export interface Invoice {
  lago_id: string;
  sequential_id: number;
  number: string;
  issuing_date: string;
  payment_status: string;
  status: string;
  invoice_type: string;
  amount_cents: number;
  amount_currency: string;
  total_amount_cents: number;
  total_amount_currency: string;
  taxes_amount_cents: number;
  credit_amount_cents: number;
  customer: Customer;
  metadata?: InvoiceMetadata[];
  created_at: string;
  updated_at: string;
}

export interface InvoiceMetadata {
  key: string;
  value: string;
}

export interface InvoiceFee {
  add_on_code?: string;
  description?: string;
  units: number;
  unit_amount_cents: number;
  tax_codes?: string[];
}

// Plan types
export interface Plan {
  lago_id: string;
  name: string;
  code: string;
  interval: string;
  amount_cents: number;
  amount_currency: string;
  description?: string;
  pay_in_advance?: boolean;
  bill_charges_monthly?: boolean;
  charges?: Charge[];
  created_at: string;
}

export interface Charge {
  lago_id?: string;
  billable_metric_id?: string;
  charge_model: string;
  pay_in_advance?: boolean;
  invoiceable?: boolean;
  min_amount_cents?: number;
  properties?: Record<string, any>;
  group_properties?: Record<string, any>[];
  tax_codes?: string[];
}

// Event types
export interface Event {
  lago_id: string;
  transaction_id: string;
  external_customer_id: string;
  code: string;
  timestamp?: number;
  properties?: Record<string, any>;
  created_at: string;
}

export interface BatchEvent {
  transaction_id: string;
  external_customer_id?: string;
  external_subscription_id?: string;
  code: string;
  timestamp?: number;
  properties?: Record<string, any>;
}

// Wallet types
export interface Wallet {
  lago_id: string;
  external_customer_id: string;
  name?: string;
  status: string;
  rate_amount: string;
  credits_balance: string;
  balance_cents: number;
  consumed_credits: string;
  currency: string;
  created_at: string;
  updated_at: string;
  terminated_at?: string;
  expiration_at?: string;
}

// Add-on types
export interface AddOn {
  lago_id: string;
  name: string;
  code: string;
  amount_cents: number;
  amount_currency: string;
  description?: string;
  created_at: string;
}

// Coupon types
export interface Coupon {
  lago_id: string;
  name: string;
  code: string;
  coupon_type: string;
  amount_cents?: number;
  amount_currency?: string;
  percentage_rate?: number;
  frequency: string;
  frequency_duration?: number;
  reusable: boolean;
  expiration?: string;
  expiration_at?: string;
  created_at: string;
}

export interface AppliedCoupon {
  lago_id: string;
  lago_coupon_id: string;
  external_customer_id: string;
  coupon_code: string;
  amount_cents?: number;
  amount_currency?: string;
  percentage_rate?: number;
  frequency: string;
  created_at: string;
}

// Webhook types
export interface WebhookEndpoint {
  lago_id: string;
  webhook_url: string;
  signature_algo: string;
  created_at: string;
}
