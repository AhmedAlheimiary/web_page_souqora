import type { PaymentProvider, PaymentProviderName } from "./types";
import { BankTransferAdapter } from "./adapters/bank-transfer";
import { StripeAdapter } from "./adapters/stripe";

class PaymentProviderRegistry {
  private providers = new Map<PaymentProviderName, PaymentProvider>();

  constructor() {
    this.register(new BankTransferAdapter());
    this.register(new StripeAdapter());
  }

  register(provider: PaymentProvider) {
    this.providers.set(provider.name, provider);
  }

  get(name: PaymentProviderName): PaymentProvider | undefined {
    return this.providers.get(name);
  }

  async getEligibleProviders(currency?: string): Promise<PaymentProvider[]> {
    const eligible: PaymentProvider[] = [];

    for (const provider of this.providers.values()) {
      const isEligible = await provider.isEligible();
      if (!isEligible) continue;

      if (currency && !provider.getSupportedCurrencies().includes(currency)) {
        continue;
      }

      eligible.push(provider);
    }

    return eligible;
  }

  /**
   * Returns eligibility comparison audit matrix across target markets
   */
  getEligibilityMatrix() {
    return [
      {
        provider: "Stripe Connect",
        targetMarket: "Saudi Arabia (KSA)",
        supportedCurrencies: ["SAR", "USD"],
        marketplaceSplitPayouts: "Supported (subject to Saudi merchant onboarding)",
        eligibilityStatus: "Requires verified Saudi commercial registration (CR) & tax certificate",
        currentStatus: "Unverified / Awaiting merchant credentials",
      },
      {
        provider: "Stripe Connect",
        targetMarket: "Yemen",
        supportedCurrencies: ["USD"],
        marketplaceSplitPayouts: "Not supported for Yemen-domiciled entities",
        eligibilityStatus: "Ineligible for direct local merchant onboarding under Stripe policies",
        currentStatus: "Disabled / Ineligible",
      },
      {
        provider: "Bank Transfer",
        targetMarket: "Saudi Arabia & Yemen",
        supportedCurrencies: ["SAR", "YER", "USD"],
        marketplaceSplitPayouts: "Manual admin reconciliation required",
        eligibilityStatus: "Permitted with local institutional or merchant bank account",
        currentStatus: "Configurable / Pending verification workflow",
      },
      {
        provider: "Regional Gateways (e.g. Moyasar, HyperPay)",
        targetMarket: "Saudi Arabia (KSA)",
        supportedCurrencies: ["SAR", "Mada", "Apple Pay"],
        marketplaceSplitPayouts: "Supported with commercial marketplace agreement",
        eligibilityStatus: "Requires Saudi commercial entity verification",
        currentStatus: "Documented for future integration",
      },
    ];
  }
}

export const paymentRegistry = new PaymentProviderRegistry();
