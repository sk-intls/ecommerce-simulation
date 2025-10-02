import { Customer, PremiumCustomer } from "./entities/Customer";
import { Product } from "./entities/Product";
import { Store } from "./entities/Store";
import { CustomerSeeder } from "./services/CustomerSeeder";
import { StoreSeeder } from "./services/ProductsSeederService";
import { CustomerType } from "./shared/types";
async function main() {
  console.log("Ecommerce app starting...");
  console.log("=========================\n");
  const store = Store.instance;
  await store.init();

  await new CustomerSeeder(store).seedCustomers();
  await new StoreSeeder(store).seedProducts();

  const customers = await store.getCustomers();
  const products = await store.getProducts();

  const regularCustomer = customers.find(
    (c) => c.customerType === CustomerType.REGULAR
  );
  const premiumCustomer = customers.find(
    (c) => c.customerType === CustomerType.PREMIUM
  );

  if (!regularCustomer || !premiumCustomer) {
    console.error("Could not find both customer types");
    return;
  }

  const expensiveProduct = products.find((p) => p.price > 500) || products[0];
  const midRangeProduct =
    products.find((p) => p.price > 50 && p.price < 200) || products[1];
  const cheapProduct = products.find((p) => p.price < 50) || products[2];

  await demonstrateCustomerJourney(
    store,
    premiumCustomer,
    [expensiveProduct, midRangeProduct],
    CustomerType.PREMIUM
  );

  await demonstrateCustomerJourney(
    store,
    regularCustomer,
    [cheapProduct],
    CustomerType.REGULAR
  );
  customers.forEach((c) => store.subscribe(c));

  await store.restockProduct(expensiveProduct, 500);
  console.log(`      Notified premium customers about ${expensiveProduct.name}`);
  await store.restockProduct(cheapProduct, 2000);
  console.log(`      Notified all customers about ${cheapProduct.name}`);
}

async function demonstrateCustomerJourney(
  store: Store,
  customer: Customer,
  productsToAdd: Product[],
  customerType: string
) {
  if (customerType == CustomerType.PREMIUM) {
    const premiumCustomer = customer as PremiumCustomer;
    console.log(`Premium Tier: ${premiumCustomer.tier}`);
    console.log(
      `Discount Rate: ${(premiumCustomer.getDiscountRate() * 100).toFixed(1)}%`
    );
  }

  for (const product of productsToAdd) {
    const quantity = Math.floor(Math.random() * 3) + 1; // 1-3 items
    customer.addToCart(product, quantity);
    console.log(
      `Added ${quantity}x ${product.name} ($${product.price.toFixed(2)} each)`
    );
  }

  let itemCount = 0;
  let subtotal = 0;

  for (const item of customer.iterateCart()) {
    itemCount++;
    const itemTotal = item.product.price * item.quantity;
    subtotal += itemTotal;
    console.log(`   ${itemCount}. ${item.product.name}`);
    console.log(
      `   Quantity: ${item.quantity}, Price: $${item.product.price.toFixed(
        2
      )}, Total: $${itemTotal.toFixed(2)}`
    );
  }

  if (customerType === CustomerType.PREMIUM) {
    const discount = subtotal * customer.getDiscountRate();
    console.log("customer discount rate", customer.getDiscountRate());
    console.log("customer discount", discount);
    console.log(
      `   Premium Discount (${(customer.getDiscountRate() * 100).toFixed(
        1
      )}%): -$${discount.toFixed(2)}`
    );
  }

  const order = await store.createOrder(customer);
  const finalOrder = await store.processOrderPayment(order.id);
  const orderSummary = finalOrder.getSummary();
  console.log(`   Order ID: #${orderSummary.id}`);
  console.log(`   Status: ${orderSummary.status}`);
  console.log(`   Payment Status: ${orderSummary.paymentStatus}`);
  console.log(`   Subtotal: $${orderSummary.total.toFixed(2)}`);
  console.log(`   Shipping: $${orderSummary.shippingCost.toFixed(2)}`);
  console.log(`   Total Paid: $${orderSummary.totalWithShipping.toFixed(2)}`);
  console.log(`   Transaction ID: ${orderSummary.transactionId}`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
