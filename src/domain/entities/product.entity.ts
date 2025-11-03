/**
 * Product aggregate root (DDD Entity + Aggregate)
 *
 * Represents a product in your domain model.
 * It emits domain events when state changes occur.
 */
// src/modules/product/domain/product.entity.ts
import { v4 as uuidv4 } from 'uuid';
import { ProductCreatedEvent } from '../events/product-created.event';
import { ProductUpdatedEvent } from '../events/product-updated.event';

export class Product {
  private domainEvents: any[] = [];

  private constructor(
    private readonly _id: string,
    private _name: string,
    private _price: number,
    private _stock: number,
  ) {}

  // ---------- Factory method ----------
  public static create(name: string, price: number, stock: number): Product {
    if (price <= 0) throw new Error('Price must be greater than zero');
    if (stock < 0) throw new Error('Stock cannot be negative');

    const product = new Product(uuidv4(), name, price, stock);
    product.addDomainEvent(
      new ProductCreatedEvent(product.id, product.name, product.price),
    );
    return product;
  }

  // Factory method for EXISTING product (no domain events)
  public static reconstitute(
    id: string,
    name: string,
    price: number,
    stock: number,
  ): Product {
    return new Product(id, name, price, stock);
  }

  // ---------- Domain behavior ----------
  public updateDetails(name: string, price: number) {
    if (price <= 0) throw new Error('Price must be greater than zero');

    this._name = name;
    this._price = price;

    this.addDomainEvent(
      new ProductUpdatedEvent(this._id, this._name, this._price),
    );
  }

  public decreaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be positive');
    if (this._stock < quantity) throw new Error('Not enough stock');
    this._stock -= quantity;
  }

  public increaseStock(quantity: number): void {
    if (quantity <= 0) throw new Error('Quantity must be positive');
    this._stock += quantity;
  }

  // ---------- Domain Events ----------
  private addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }

  public pullDomainEvents(): any[] {
    const events = [...this.domainEvents];
    this.domainEvents = [];
    return events;
  }

  // ---------- Getters ----------
  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get price(): number {
    return this._price;
  }

  get stock(): number {
    return this._stock;
  }
}
