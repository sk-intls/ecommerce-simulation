import "reflect-metadata";
import { DataSource } from "typeorm";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "ecommerce.db",
  synchronize: true,
  logging: false,
  entities: [],
});

async function initializeDB(): Promise<DataSource> {
  try {
    const dataSource = await AppDataSource.initialize();
    console.log("DB connection established successfully[sqlite]");
    return dataSource;
  } catch (error) {
    console.error("Could not connect to DB ", error);
    throw error;
  }
}

export async function closeConnection(): Promise<void> {
  try {
    await AppDataSource.destroy();
    console.log("DB connection is closed");
  } catch (error) {
    console.error("Error closing DB connection");
    throw error;
  }
}
