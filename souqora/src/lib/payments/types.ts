export type PaymentProviderName =
  | "stripe"
  | "paypal"
  | "bank_transfer"
  | "sandbox";

export interface CheckoutSessionOptions {
  orderId: string;
  orderNumber: string;
  amount: number; // minor currency units (e.g., 10000 = 100.00 SAR)
  currency: "SAR" | "YER" | "USD";
  customerEmail: string;
  customerName?: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, string>;
}

export interface CheckoutSessionResult {
  sessionId: string;
  checkoutUrl: string;
  provider: PaymentProviderName;
  requiresManualVerification?: boolean;
}

export interface PaymentStatusResult {
  transactionReference: string;
  status: "PENDING" | "PROCESSING" | "PAID" | "FAILED" | "CANCELLED" | "REFUNDED";
  amount: number;
  currency: string;
  paidAt?: Date;
  rawEvent?: unknown;
}

export interface WebhookVerificationResult {
  isValid: boolean;
  eventType: string;
  transactionReference?: string;
  paymentStatus?: "PAID" | "FAILED" | "PENDING";
  amount?: number;
  currency?: string;
  rawPayload?: unknown;
}

export interface RefundOptions {
  transactionReference: string;
  amount: number; // minor units
  currency: string;
  reason?: string;
}

export interface RefundResult {
  refundId: string;
  status: "COMPLETED" | "PENDING" | "FAILED";
  amount: number;
}

export interface PaymentProvider {
  name: PaymentProviderName;
  isEligible(): Promise<boolean>;
  getSupportedCurrencies(): string[];
  createCheckoutSession(
    options: CheckoutSessionOptions
  ): Promise<CheckoutSessionResult>;
  retrievePaymentStatus(
    transactionReference: string
  ): Promise<PaymentStatusResult>;
  verifyWebhook(
    headers: Record<string, string>,
    rawBody: string
  ): Promise<WebhookVerificationResult>;
  requestRefund(options: RefundOptions): Promise<RefundResult>;
}
