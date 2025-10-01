import { CustomerType, PaymentResult, PaymentStatus } from "../shared/types";

export class PaymentServise {
  private static readonly SHIPPING_COST = 9.99;
  async processPayment(
    orderTotal: number,
    customerType: CustomerType,
    customerName: string
  ): Promise<PaymentResult> {
    console.log(`Processing payment for ${customerName} (${customerType})`);
    const shippingCost =
      customerType == CustomerType.PREMIUM ? 0 : PaymentServise.SHIPPING_COST;
    const totalAmount = shippingCost + orderTotal;
    console.log(`Total amount to charge ${totalAmount.toFixed(2)}`);
    await this.simulatePaymentDelay();
    const paymentSuccessful = Math.random() < 0.85;
    const transactionId = this.generateFakeTransactionId();
    if (paymentSuccessful) {
      console.log(`Payment successful, transaction id is ${transactionId}`);
      return {
        success: true,
        transactionId,
        status: PaymentStatus.COMPLETED,
        totalAmount,
        shippingCost,
        message: `Payment of $${totalAmount.toFixed(2)} processed successfully`,
      };
    } else {
      console.log(`Payment failed - insufficient funds or card declined`);
      return {
        success: false,
        transactionId,
        status: PaymentStatus.FAILED,
        totalAmount,
        shippingCost,
        message:
          "Payment failed - please check your payment method and try again",
      };
    }
  }

  private async simulatePaymentDelay(): Promise<void> {
    const delay = Math.floor(Math.random() * 2000) + 1000;
    return new Promise((resolve) => setTimeout(resolve, delay));
  }

  private generateFakeTransactionId(): string {
    const part_1 = Date.now().toString(36).toUpperCase();
    const part_2 = Math.random().toString(36).toUpperCase();
    return `TXN_${part_1}_${part_2}`;
  }
}
