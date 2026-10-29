import type {
  PaymentProvider,
  CheckoutSessionOptions,
  CheckoutSessionResult,
  PaymentStatusResult,
  WebhookVerificationResult,
  RefundOptions,
  RefundResult,
} from "../types";

export class BankTransferAdapter implements PaymentProvider {
  readonly name = "bank_transfer" as const;

  async isEligible(): Promise<boolean> {
    // Bank transfer is permitted when bank details are configured by administrator
    return Boolean(
      process.env.BANK_TRANSFER_ENABLED === "true" &&
        process.env.BANK_ACCOUNT_NUMBER
    );
  }

  getSupportedCurrencies(): string[] {
    return ["SAR", "YER", "USD"];
  }

  async createCheckoutSession(
    options: CheckoutSessionOptions
  ): Promise<CheckoutSessionResult> {
    const reference = `BT-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    return {
      sessionId: reference,
      checkoutUrl: `/checkout/bank-transfer?ref=${reference}&orderId=${options.orderId}`,
      provider: "bank_transfer",
      requiresManualVerification: true,
    };
  }

  async retrievePaymentStatus(
    transactionReference: string
  ): Promise<PaymentStatusResult> {
    // Bank transfers remain PENDING until explicitly reconciled by an administrator
    return {
      transactionReference,
      status: "PENDING",
      amount: 0,
      currency: "SAR",
    };
  }

  async verifyWebhook(): Promise<WebhookVerificationResult> {
    // Bank transfers do not use public webhook endpoints
    return {
      isValid: false,
      eventType: "bank_transfer_unsupported",
    };
  }

  async requestRefund(options: RefundOptions): Promise<RefundResult> {
    return {
      refundId: `REFUND-MANUAL-${Date.now()}`,
      status: "PENDING",
      amount: options.amount,
    };
  }
}
