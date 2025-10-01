export interface IProduct {
  id: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  category?: string;
}

export enum CustomerType {
  REGULAR = "regular",
  PREMIUM = "premium",
}

export type CartItem<T> = {
  product: T;
  quantity: number;
};

export type CustomerTierType = "GOLD" | "SILVER" | "PLATINUM";

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export interface PaymentResult {
  success: boolean;
  transactionId: string;
  status: PaymentStatus;
  totalAmount: number;
  shippingCost: number;
  message: string;
}

export type OrderStatusType =
  | "PENDING"
  | "PAID"
  | "CANCELLED"
  | "SHIPPED"
  | "COMPLETED";
