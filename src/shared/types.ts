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

export interface FakeCustomer {
  id: number;
  name: string;
  customerType: CustomerType;
  birth?: Date;
}

export interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

export interface IObserver {
  update(product: IProduct): void;
  getId(): number;
}