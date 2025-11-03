// src/modules/product/domain/product.repository.ts
import { Product } from '../entities/product.entity';

export abstract class ProductRepository {
  abstract save(product: Product): Promise<void>;
  abstract findById(id: string): Promise<Product | null>;
  abstract findAll(): Promise<Product[]>;
}

export const PRODUCT_REPOSITORY = Symbol('ProductRepository');
