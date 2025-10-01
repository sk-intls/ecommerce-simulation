import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity("products")
export class Product {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: "varchar", length: 50 })
  name!: string;

  @Column({ type: "decimal", precision: 10, scale: 2 })
  price!: number;

  @Column({ type: "integer" })
  stock!: number;

  @Column({ type: "text", length: 100, nullable: true })
  description?: string;

  @Column({ type: "text", length: 100, nullable: true })
  category?: string;
}

export function isProduct(obj: any): obj is Product {
  return (
    !!obj &&
    typeof obj === "object" &&
    typeof obj.id === "number" &&
    obj.id > 0 &&
    typeof obj.name === "string" &&
    obj.name.trim().length > 0 &&
    typeof obj.price === "number" &&
    obj.price >= 0 &&
    Number.isFinite(obj.price) &&
    typeof obj.stock === "number" &&
    obj.stock >= 0 &&
    Number.isInteger(obj.stock) &&
    (obj.description === undefined || typeof obj.description === "string") &&
    (obj.category === undefined || typeof obj.category === "string")
  );
}
