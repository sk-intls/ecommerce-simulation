import { CustomerType, FakeCustomer } from "./types";

export const fakeCustomers: FakeCustomer[] = [
  {
    id: 1,
    name: "Alice Johnson",
    customerType: CustomerType.PREMIUM,
    birth: new Date("1988-03-15"),
  },
  {
    id: 2,
    name: "Bob Smith",
    customerType: CustomerType.REGULAR,
    birth: new Date("1992-07-22"),
  },
  {
    id: 3,
    name: "Carol Davis",
    customerType: CustomerType.PREMIUM,
    birth: new Date("1985-11-08"),
  },
  {
    id: 4,
    name: "David Wilson",
    customerType: CustomerType.REGULAR,
    birth: new Date("1990-01-30"),
  },
  {
    id: 5,
    name: "Emma Thompson",
    customerType: CustomerType.PREMIUM,
    birth: new Date("1987-09-12"),
  },
  {
    id: 6,
    name: "Frank Miller",
    customerType: CustomerType.REGULAR,
    birth: new Date("1993-04-18"),
  },
];
