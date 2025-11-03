import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductRepository } from '../../domain/repositories/product.repository';
import { Product } from '../../domain/entities/product.entity';
import { ProductOrmEntity } from '../entities/product.orm-entity';

@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductOrmEntity)
    private readonly ormRepo: Repository<ProductOrmEntity>,
  ) {}

  async save(product: Product): Promise<void> {
    const ormEntity = new ProductOrmEntity();
    ormEntity.id = product.id;
    ormEntity.name = product.name;
    ormEntity.price = product.price;
    ormEntity.stock = product.stock;

    await this.ormRepo.save(ormEntity);
  }

  async findById(id: string): Promise<Product | null> {
    const ormEntity = await this.ormRepo.findOne({ where: { id } });
    if (!ormEntity) return null;

    // Map back to domain entity
    return Product.reconstitute(
      ormEntity.id,
      ormEntity.name,
      Number(ormEntity.price),
      ormEntity.stock,
    );
  }

  async findAll(): Promise<Product[]> {
    const ormEntities = await this.ormRepo.find();
    return ormEntities.map((e) =>
      Product.reconstitute(e.id, e.name, Number(e.price), e.stock),
    );
  }
}
