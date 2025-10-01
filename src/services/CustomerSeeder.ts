import { Store } from "../entities/Store";
import { fakeCustomers } from "../shared/dummyData";
import { CustomerType } from "../shared/types";

export class CustomerSeeder {
  private store: Store;
  constructor(store: Store) {
    this.store = store;
  }

  async seedCustomers(): Promise<void> {
    console.log("Seeding customers..");
    for (const customer of fakeCustomers) {
      try {
        const customerData = {
          name: customer.name,
          customerType: customer.customerType,
          birth: customer.birth,
          tier:
            customer.customerType == CustomerType.PREMIUM
              ? this.getRandomPremiumTier()
              : undefined,
        };

        await this.store.addCustomer(customerData);
      } catch (error) {
        console.error("Failed to add customer");
      }
    }
  }

  private getRandomPremiumTier(): string {
    const tiers = ["SILVER", "GOLD", "PLATINUM"];
    return tiers[Math.floor(Math.random() * tiers.length)];
  }
}
