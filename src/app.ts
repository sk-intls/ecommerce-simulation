import { Store } from "./entities/Store";
import { CustomerSeeder } from "./services/CustomerSeeder";
async function main() {
  console.log("Ecommerce app starting...");
  console.log("=========================\n");
  const store = Store.instance;
  await store.init();

  await new CustomerSeeder(store).seedCustomers()
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
