import {
  ChildEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  TableInheritance,
} from "typeorm";
import {
  CartItem,
  CustomerTierType,
  CustomerType,
  IProduct,
} from "../shared/types";
import { RequirePremium } from "../decorators/RequirePremium";

@Entity("customers")
@TableInheritance({ column: { type: "varchar", name: "customerType" } })
export abstract class Customer {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 100 })
  name!: string;

  @Column({
    type: "simple-enum",
    enum: CustomerType,
    default: CustomerType.REGULAR,
  })
  customerType!: CustomerType;

  @Column({ type: "date", nullable: true })
  birth?: Date;

  protected cart: CartItem<IProduct>[] = [];

  abstract getDiscountRate(): number;
  abstract getIsPremium(): boolean;

  getName(): string {
    return this.name;
  }

  getId(): number {
    return this.id;
  }

  addToCart(product: IProduct, quantity: number = 1): void {
    const existingItemInCart = this.cart.find(
      (item) => item.product.id === product.id
    );

    if (existingItemInCart) {
      existingItemInCart.quantity += 1;
    } else {
      this.cart.push({ product, quantity });
    }
  }

  getCart(): CartItem<IProduct>[] {
    return [...this.cart];
  }

  clearCart(): void {
    this.cart = [];
  }

  getCartTotal(): number {
    const totalWithNoDiscount = this.cart.reduce(
      (sum, cartItem) => sum + cartItem.product.price * cartItem.quantity,
      0
    );
    return (1 - this.getDiscountRate()) * totalWithNoDiscount;
  }

  *iterateCart(): Generator<CartItem<IProduct>, void, unknown> {
    for (const item of this.cart) {
      yield item;
    }
  }

  @RequirePremium()
  getShippingCost(): number {
    return 0;
  }
}

@ChildEntity("regular")
export class RegularCustomer extends Customer {
  getDiscountRate(): number {
    return 0;
  }

  getIsPremium(): boolean {
    return false;
  }
}

@ChildEntity("premium")
export class PremiumCustomer extends Customer {
  @Column({ type: "decimal", precision: 5, scale: 2, default: 0.1 })
  discountRate: number = 0.1;

  @Column({ type: "varchar", length: 20, default: "GOLD" })
  tier: CustomerTierType = "GOLD";

  getDiscountRate(): number {
    return this.discountRate;
  }

  getIsPremium(): boolean {
    return this.customerType == CustomerType.PREMIUM;
  }

  setPremiumTier(tier: CustomerTierType): void {
    this.tier = tier;

    switch (tier) {
      case "SILVER":
        this.discountRate = 0.05;
        break;
      case "GOLD":
        this.discountRate = 0.1;
        break;
      case "PLATINUM":
        this.discountRate = 0.15;
        break;
    }
  }
}
