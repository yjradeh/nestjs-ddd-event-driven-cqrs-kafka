import { Injectable, OnModuleInit, Inject, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { EventPublisherContract } from '../../domain/contracts/event-publisher.contract';

@Injectable()
export class KafkaEventPublisher
  implements EventPublisherContract, OnModuleInit
{
  private readonly logger = new Logger(KafkaEventPublisher.name);
  private readonly topic = 'domain-events';
  constructor(
    @Inject('KAFKA_CLIENT')
    private readonly kafkaClient: ClientKafka,
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  async publish(event: any): Promise<void> {
    if (!event) return;

    const eventType = event?.constructor?.name ?? 'UnknownEvent';
    const key = (event && (event.aggregateId || event.id)) || 'default';

    const value = JSON.stringify(event);

    await this.kafkaClient.producer.send({
      topic: this.topic,
      messages: [
        {
          key,
          value,
          headers: {
            eventType: eventType,
            publishedTime: new Date().toISOString(),
          },
        },
      ],
    });

    this.logger.log(`Event ${eventType} published with key ${key}`);
  }

  async bulkPublish(events: any[]): Promise<void> {
    for (const event of events) {
      await this.publish(event);
    }
  }
}
