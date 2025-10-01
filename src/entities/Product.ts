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
    typeof obj.id == "number" &&
    typeof obj.name == "string" &&
    typeof obj.price == "number" &&
    typeof obj.stock == "number"
  );
}
