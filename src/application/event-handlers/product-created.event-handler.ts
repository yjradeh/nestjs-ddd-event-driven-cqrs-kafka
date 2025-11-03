import { Injectable, Logger, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductCreatedEvent } from '../../domain/events/product-created.event';

@Injectable()
export class ProductCreatedEventHandler {
  private readonly logger = new Logger(ProductCreatedEventHandler.name);

  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  handle(event: ProductCreatedEvent) {
    this.logger.log(
      `ProductCreatedEvent handled: id=${event.id}, name=${event.name}, price=${event.price}`,
    );
  }
}
