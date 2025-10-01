import { Store } from "./entities/Store";
async function main() {
  console.log("Ecommerce app starting...");
  console.log("=========================\n");
  const store = Store.instance;
  await store.init();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
