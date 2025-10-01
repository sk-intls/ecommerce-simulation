# E-Commerce Store Simulator

A TypeScript-based e-commerce simulation demonstrating advanced OOP concepts, design patterns, and TypeORM integration.

## Features Implemented

### Core Entities
- **Store** - Singleton service managing products, customers, and orders
- **Product** - Entity with `isProduct()` type guard for API data validation
- **Customer** - Generic cart system with inheritance:
  - `PremiumCustomer` - Tiered discounts and free shipping
  - `RegularCustomer` - Standard pricing
- **Order** - Entity with utility type `OrderSummary` for structured data

### TypeScript & OOP Features
- **Encapsulation** - Private fields (`#stock`, payment details)
- **Inheritance** - Customer base class extended by Premium/Regular
- **Type Guards** - `isProduct()` for runtime validation
- **Utility Types** - `Pick<Order, ...>` for OrderSummary
- **Generics** - Generic cart implementation

### Design Patterns
- **Singleton** - Global Store instance
- **Observer** - Customer notifications (restock/sales)
- **Decorator** - `@RequirePremium` for restricted actions

### Async Operations
- Payment processing simulation
- External API integration (FakeStore API)
- Database operations with TypeORM

### Advanced Features
- **Generators** - Cart iteration with `*iterateCart()`
- **TypeORM** - Entities with `@Entity`, `@Column`, `@ManyToOne`
- **SQLite** - Local database persistence

## Usage

```bash
npm install
npm start
```

## Tech Stack
- TypeScript
- TypeORM
- SQLite
- Node.js
- FakeStore API

## Architecture
```
src/
├── entities/     # TypeORM entities
├── services/     # Business logic
├── decorators/   # Custom decorators
├── database/     # DB configuration
└── shared/       # Types & utilities
```