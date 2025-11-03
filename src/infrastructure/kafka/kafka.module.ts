import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { DomainEventsKafkaController } from './domain-events.controller';
import { KafkaEventPublisher } from './kafka-event-publisher';
import { EVENT_PUBLISH_CONTRACT } from '../../domain/contracts/event-publisher.contract';
export const KAFKA_CLIENT = 'KAFKA_CLIENT';

@Module({
  imports: [
    // to be replaced in config or .env
    ClientsModule.register([
      {
        name: KAFKA_CLIENT,
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'order-system',
            brokers: ['localhost:9092'],
          },
          producer: {
            allowAutoTopicCreation: true,
          },
          consumer: {
            groupId: 'order-service-consumer',
          },
        },
      },
    ]),
  ],
  controllers: [DomainEventsKafkaController],
  providers: [
    KafkaEventPublisher,
    {
      provide: EVENT_PUBLISH_CONTRACT,
      useClass: KafkaEventPublisher,
    },
  ],
  exports: [EVENT_PUBLISH_CONTRACT], // Export if needed in other modules
})
export class KafkaModule {}
