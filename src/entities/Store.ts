import { Repository } from "typeorm";
import { Product } from "./Product";
import { AppDataSource } from "../database/config";

export class Store {
  static #instance: Store;
  private initialized: boolean = false;
  private productRepository!: Repository<Product>;

  public static get instance(): Store {
    if (!Store.#instance) {
      Store.#instance = new Store();
    }
    return Store.#instance;
  }

  async init(): Promise<void> {
    if (this.initialized) {
      console.error("Store is already initialized");
      return;
    }

    try {
      console.log("Initializing AppDataSource...");
      await AppDataSource.initialize();

      this.productRepository = AppDataSource.getRepository(Product);
      this.initialized = true;
      console.log("Store initialized successfully");
    } catch (error) {
      console.error("Failed to initialize store ", error);
      throw error;
    }
  }
}
