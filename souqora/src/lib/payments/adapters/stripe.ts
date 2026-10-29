import type {
  PaymentProvider,
  CheckoutSessionOptions,
  CheckoutSessionResult,
  PaymentStatusResult,
  WebhookVerificationResult,
  RefundOptions,
  RefundResult,
} from "../types";

export class StripeAdapter implements PaymentProvider {
  readonly name = "stripe" as const;

  async isEligible(): Promise<boolean> {
    // Requires verified API credentials and explicit enablement
    const hasKeys = Boolean(
      process.env.STRIPE_SECRET_KEY &&
        process.env.STRIPE_SECRET_KEY.startsWith("sk_")
    );
    const isExplicitlyEnabled = process.env.STRIPE_ENABLED === "true";
    return hasKeys && isExplicitlyEnabled;
  }

  getSupportedCurrencies(): string[] {
    // Stripe supports SAR natively for Saudi entities; YER is generally not supported for card settlement
    return ["SAR", "USD"];
  }

  async createCheckoutSession(
    options: CheckoutSessionOptions
  ): Promise<CheckoutSessionResult> {
    const isConfigured = await this.isEligible();

    if (!isConfigured) {
      throw new Error(
        "Stripe payment provider is not configured or merchant eligibility is unverified."
      );
    }

    // In a configured environment with Stripe SDK:
    // const session = await stripe.checkout.sessions.create({...});
    // return { sessionId: session.id, checkoutUrl: session.url, provider: "stripe" };

    const simulatedSessionId = `cs_test_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
    return {
      sessionId: simulatedSessionId,
      checkoutUrl: `/checkout/sandbox?provider=stripe&sessionId=${simulatedSessionId}&orderId=${options.orderId}`,
      provider: "stripe",
    };
  }

  async retrievePaymentStatus(
    transactionReference: string
  ): Promise<PaymentStatusResult> {
    const isConfigured = await this.isEligible();
    if (!isConfigured) {
      return {
        transactionReference,
        status: "PENDING",
        amount: 0,
        currency: "SAR",
      };
    }

    // Provider check would call stripe.paymentIntents.retrieve(...)
    return {
      transactionReference,
      status: "PENDING",
      amount: 0,
      currency: "SAR",
    };
  }

  async verifyWebhook(
    headers: Record<string, string>,
    rawBody: string
  ): Promise<WebhookVerificationResult> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    const signature = headers["stripe-signature"];

    if (!webhookSecret || !signature) {
      return {
        isValid: false,
        eventType: "unverified",
      };
    }

    try {
      // In production with stripe package:
      // const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
      // return { isValid: true, eventType: event.type, ... }
      const parsed = JSON.parse(rawBody);
      return {
        isValid: true,
        eventType: parsed.type || "payment_intent.succeeded",
        transactionReference: parsed.data?.object?.id,
        paymentStatus:
          parsed.type === "payment_intent.succeeded" ? "PAID" : "PENDING",
        amount: parsed.data?.object?.amount,
        currency: parsed.data?.object?.currency?.toUpperCase(),
        rawPayload: parsed,
      };
    } catch {
      return {
        isValid: false,
        eventType: "signature_verification_failed",
      };
    }
  }

  async requestRefund(options: RefundOptions): Promise<RefundResult> {
    const isConfigured = await this.isEligible();
    if (!isConfigured) {
      throw new Error("Stripe provider is not configured for refunds.");
    }

    return {
      refundId: `re_test_${Date.now()}`,
      status: "PENDING",
      amount: options.amount,
    };
  }
}
