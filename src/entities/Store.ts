import { Repository } from "typeorm";
import { Product } from "./Product";
import { AppDataSource } from "../database/config";
import { Customer, PremiumCustomer, RegularCustomer } from "./Customer";
import { Order } from "./Order";
import { PaymentServise } from "../services/PaymentService";
import {
  CustomerType,
  IProduct,
  PaymentStatus,
  CustomerTierType,
} from "../shared/types";

export class Store {
  static #instance: Store;
  private initialized: boolean = false;
  private productRepository!: Repository<Product>;
  private customersRepository!: Repository<Customer>;
  private ordersRepository!: Repository<Order>;
  private paymentService: PaymentServise;
  private observers: Map<number, Customer> = new Map();

  private constructor() {
    this.paymentService = new PaymentServise();
  }

  private notify(product: IProduct, customerType?: CustomerType): void {
    this.observers.forEach((customer) => {
      if (!customerType || customer.customerType === customerType) {
        customer.update(product);
      }
    });
  }

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
      this.customersRepository = AppDataSource.getRepository(Customer);
      this.ordersRepository = AppDataSource.getRepository(Order);

      this.initialized = true;
      console.log("Store initialized successfully");
    } catch (error) {
      console.error("Failed to initialize store ", error);
      throw error;
    }
  }

  async addProduct(
    productData: IProduct | Omit<IProduct, "id">
  ): Promise<Product> {
    try {
      const product = this.productRepository.create(productData);
      const savedProduct = await this.productRepository.save(product);
      return savedProduct;
    } catch (error) {
      console.error("Failed to add product: ", error);
      throw error;
    }
  }

  async getProducts(): Promise<Product[]> {
    try {
      return await this.productRepository.find();
    } catch (error) {
      console.error("Failed to fetch products: ", error);
      throw error;
    }
  }

  async restockProduct(product: IProduct, quantity: number): Promise<void> {
    if (!product || !product.id) {
      throw new Error("Product is required and must have an ID");
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw new Error("Quantity must be a positive integer");
    }

    try {
      const existingProduct = await this.productRepository.findOneBy({
        id: product.id,
      });
      if (!existingProduct) {
        throw new Error("No such product found");
      }

      existingProduct.addStock(quantity);
      await this.productRepository.save(existingProduct);

      if (existingProduct.price < 50) {
        this.notify(existingProduct);
      } else {
        this.notify(existingProduct, CustomerType.PREMIUM);
      }
    } catch (error) {
      console.error("Failed to restock product:", error);
      throw error;
    }
  }

  async addCustomer(customerData: {
    name: string;
    customerType: CustomerType;
    birth?: Date;
    tier?: string;
  }): Promise<Customer> {
    try {
      const existingCustomerQuery: any = { name: customerData.name };
      if (customerData.birth) {
        existingCustomerQuery.birth = customerData.birth;
      }
      
      const existingCustomer = await this.customersRepository.findOne({
        where: existingCustomerQuery
      });
      
      if (existingCustomer) {
        console.log(
          `Customer already exists: ${existingCustomer.name} (ID: ${existingCustomer.id})${customerData.birth ? ` born on ${customerData.birth.toDateString()}` : ''}`
        );
        return existingCustomer;
      }

      let customer: Customer;
      if (customerData.customerType == CustomerType.PREMIUM) {
        customer = new PremiumCustomer();
        customer.name = customerData.name;
        customer.customerType = CustomerType.PREMIUM;
        if (customerData.birth) customer.birth = customerData.birth;
        if (customerData.tier) {
          const validTiers: CustomerTierType[] = ["GOLD", "SILVER", "PLATINUM"];
          if (validTiers.includes(customerData.tier as CustomerTierType)) {
            (customer as PremiumCustomer).setPremiumTier(
              customerData.tier as CustomerTierType
            );
          } else {
            throw new Error(`Invalid tier: ${customerData.tier}. Must be one of: ${validTiers.join(", ")}`);
          }
        }
      } else {
        customer = new RegularCustomer();
        customer.name = customerData.name;
        customer.customerType = CustomerType.REGULAR;
        if (customerData.birth) customer.birth = customerData.birth;
      }

      const savedCustomer = await this.customersRepository.save(customer);
      console.log(
        `New customer created: ${savedCustomer.name} (ID: ${savedCustomer.id}) - ${savedCustomer.customerType}`
      );
      return savedCustomer;
    } catch (error) {
      console.log("Error while saving customer: ", error);
      throw error;
    }
  }

  async getCustomers(): Promise<Customer[]> {
    try {
      const customers = await this.customersRepository.find();
      return customers;
    } catch (error) {
      console.error("Error fetching customers: ", error);
      throw error;
    }
  }

  async createOrder(customer: Customer): Promise<Order> {
    try {
      const id = customer?.getId();
      const customerExists = await this.customersRepository.findOneBy({ id });
      if (!customerExists) {
        throw new Error("Customer not found");
      }

      const order = new Order();
      order.customer = customer;
      order.status = "PENDING";
      order.total = customer.getCartTotal();
      order.paymentStatus = PaymentStatus.PENDING;

      const savedOrder = await this.ordersRepository.save(order);
      console.log(
        `Created order (id: ${savedOrder.id}) for customer: ${customer.name}`
      );

      return savedOrder;
    } catch (error) {
      console.error("Error while creating order: ", error);
      throw error;
    }
  }

  async processOrderPayment(orderId: number): Promise<Order> {
    try {
      const order = await this.ordersRepository.findOneBy({ id: orderId });
      if (!order) {
        throw new Error("Order not found");
      }

      if (order.paymentStatus === PaymentStatus.COMPLETED) {
        console.log(`Order ${orderId} is already paid`);
        return order;
      }

      console.log(`\n Processing payment for Order #${orderId}`);
      console.log(
        `Customer: ${order.customer.name} (${order.customer.customerType})`
      );

      const paymentResult = await this.paymentService.processPayment(
        order.total,
        order.customer.customerType,
        order.customer.name
      );

      order.updatePaymentInfo(
        paymentResult.transactionId,
        paymentResult.status,
        paymentResult.shippingCost
      );

      const updatedOrder = await this.ordersRepository.save(order);

      if (paymentResult.success) {
        console.log(`Order #${orderId} payment completed successfully!`);
        order.customer.clearCart();
        await this.customersRepository.save(order.customer);
      } else {
        console.log(
          `Order #${orderId} payment failed: ${paymentResult.message}`
        );
      }

      return updatedOrder;
    } catch (error) {
      console.error("Error while processing payment: ", error);
      throw error;
    }
  }

  async getOrders(): Promise<Order[]> {
    try {
      return await this.ordersRepository.find();
    } catch (error) {
      console.error("Error fetching orders: ", error);
      throw error;
    }
  }

  subscribe(customer: Customer): void {
    if (!customer || !customer.getId) {
      throw new Error("Customer is required and must have getId method");
    }

    const customerId = customer.getId();
    if (!customerId) {
      throw new Error("Customer must have a valid ID");
    }

    if (!this.observers.has(customerId)) {
      this.observers.set(customerId, customer);
      console.log(
        `Customer ${customer.name} (ID: ${customerId}) is now subscribed to notifications`
      );
    } else {
      console.log(
        `Customer ${customer.name} (ID: ${customerId}) is already subscribed to notifications`
      );
    }
  }

  unsubscribe(customer: Customer): boolean {
    if (!customer || !customer.getId) {
      throw new Error("Customer is required and must have getId method");
    }

    const customerId = customer.getId();
    if (!customerId) {
      throw new Error("Customer must have a valid ID");
    }

    const removed = this.observers.delete(customerId);
    if (removed) {
      console.log(
        `Customer ${customer.name} (ID: ${customerId}) has been unsubscribed from notifications`
      );
    } else {
      console.log(
        `Customer ${customer.name} (ID: ${customerId}) was not subscribed to notifications`
      );
    }
    return removed;
  }

  clearAllSubscriptions(): void {
    const count = this.observers.size;
    this.observers.clear();
    console.log(`Cleared ${count} subscription(s)`);
  }
}
