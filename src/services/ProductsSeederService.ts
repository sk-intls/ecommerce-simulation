import { Store } from "../entities/Store";
import { IProduct, FakeStoreProduct } from "../shared/types";

export class StoreSeeder {
  private static readonly PRODUCTS_API_URL =
    "https://fakestoreapi.com/products";
  private store: Store;
  constructor(store: Store) {
    this.store = store;
  }

  async fetchProducts(): Promise<FakeStoreProduct[]> {
    try {
      const response = await fetch(StoreSeeder.PRODUCTS_API_URL);
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      const data = await response.json();
      if (
        !Array.isArray(data) ||
        !data.every(
          (item) =>
            typeof item.id === "number" &&
            typeof item.title === "string" &&
            typeof item.price === "number" &&
            typeof item.description === "string" &&
            typeof item.category === "string" &&
            typeof item.image === "string" &&
            typeof item.rating === "object" &&
            typeof item.rating.rate === "number" &&
            typeof item.rating.count === "number"
        )
      ) {
        throw new Error("Invalid product data format");
      }
      return data as FakeStoreProduct[];
    } catch (error) {
      console.error("Failed to fetch fake product data: ", error);
      throw error;
    }
  }

  async seedProducts(): Promise<void> {
    try {
      const fakeProducts = await this.fetchProducts();
      for (const fakeProduct of fakeProducts) {
        const productData: Omit<IProduct, "id"> = {
          name: fakeProduct.title,
          price: fakeProduct.price,
          stock: fakeProduct.rating.count,
          description: fakeProduct.description,
          category: fakeProduct.category,
        };
        await this.store.addProduct(productData);
      }
      console.log("Products seeded successfully");
    } catch (error) {
      console.error("Failed to seed products: ", error);
      throw error;
    }
  }
}
