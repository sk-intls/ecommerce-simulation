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
