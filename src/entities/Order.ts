import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { OrderStatusType, PaymentStatus } from "../shared/types";
import { Customer } from "./Customer";

@Entity("orders")
export class Order {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 20, default: "PENDING" })
  status!: OrderStatusType;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  total!: number;

  @Column({ type: "decimal", precision: 10, scale: 2, default: 0 })
  shippingCost!: number;

  @Column({ type: "varchar", length: 50, nullable: true })
  transactionId?: string;

  @Column({ type: "varchar", length: 20, default: "PENDING" })
  paymentStatus!: PaymentStatus;

  @ManyToOne(() => Customer, { eager: true })
  customer!: Customer;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  markAsPaid(): void {
    this.status = "PAID";
  }

  markAsCanceled(): void {
    this.status = "CANCELLED";
  }

  markAsCompleted(): void {
    this.status = "COMPLETED";
  }

  markAsShipped(): void {
    this.status = "SHIPPED";
  }
  updatePaymentInfo(
    transactionId: string,
    paymentStatus: PaymentStatus,
    shippingCost: number
  ): void {
    this.transactionId = transactionId;
    this.paymentStatus = paymentStatus;
    this.shippingCost = shippingCost;

    if (paymentStatus === PaymentStatus.COMPLETED) {
      this.markAsPaid();
    }
  }

  getTotalWithShipping(): number {
    return this.total + this.shippingCost;
  }

  getSummary() {
    return {
      id: this.id,
      status: this.status,
      total: this.total,
      shippingCost: this.shippingCost,
      totalWithShipping: this.getTotalWithShipping(),
      paymentStatus: this.paymentStatus,
      transactionId: this.transactionId,
      customerId: this.customer?.id,
      customerName: this.customer?.name,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }
}
