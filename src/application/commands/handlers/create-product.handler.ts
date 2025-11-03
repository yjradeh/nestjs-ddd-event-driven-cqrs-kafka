// src/modules/product/application/event-handlers/create-product.handler.ts
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from '../create-product.command';
import {
  PRODUCT_REPOSITORY,
  ProductRepository,
} from '../../../domain/repositories/product.repository';
import { Product } from '../../../domain/entities/product.entity';
import { Inject } from '@nestjs/common';
import {
  EVENT_PUBLISH_CONTRACT,
  EventPublisherContract,
} from '../../../domain/contracts/event-publisher.contract';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @Inject(PRODUCT_REPOSITORY)
    private readonly repository: ProductRepository,
    @Inject(EVENT_PUBLISH_CONTRACT)
    private readonly eventPublisher: EventPublisherContract,
  ) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const { name, price, stock } = command;

    // 1️⃣ Create aggregate
    const product = Product.create(name, price, stock);

    // 2️⃣ Save in repository
    await this.repository.save(product);

    // 3️⃣ Publish domain events
    await this.eventPublisher.bulkPublish(product.pullDomainEvents());
  }
}
