import { Controller, Logger } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';
import { EventBus } from '@nestjs/cqrs';
import { ProductCreatedEventHandler } from '../../application/event-handlers/product-created.event-handler';
import { ModuleRef } from '@nestjs/core';

// Registry mapping Kafka header `eventType` to a constructor
const EVENT_TYPE_REGISTRY: Record<string, new (...args: any[]) => any> = {
  ProductCreatedEvent: ProductCreatedEventHandler,
};

@Controller()
export class DomainEventsKafkaController {
  private readonly logger = new Logger(DomainEventsKafkaController.name);

  constructor(
    private readonly eventBus: EventBus,
    private moduleRef: ModuleRef,
  ) {}

  @MessagePattern('domain-events')
  async handleDomainEvent(@Payload() value: any, @Ctx() context: KafkaContext) {
    try {
      const message = context.getMessage();
      const headers = Object.fromEntries(
        Object.entries(message.headers ?? {}).map(([k, v]) => [
          k,
          (v as Buffer | string | undefined)?.toString?.() ?? String(v),
        ]),
      );

      const eventType = headers['eventType'];
      if (!eventType) {
        this.logger.warn(
          'Received message without eventType header. Skipping.',
        );
        return;
      }

      const ctor = EVENT_TYPE_REGISTRY[eventType];
      if (!ctor) {
        this.logger.warn(
          `No event class registered for eventType="${eventType}". Skipping.`,
        );
        return;
      }

      // Allow resolution outside strict module context
      const instance = this.moduleRef.get(ctor, { strict: false });
      if (!instance) {
        this.logger.warn(
          `Provider for ${ctor.name} not found. Ensure it is exported and module imported.`,
        );
        return;
      }

      const payload = typeof value === 'string' ? JSON.parse(value) : value;
      await instance.handle(payload);
    } catch (err) {
      this.logger.error(
        `Failed to handle domain event message: ${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }
}
