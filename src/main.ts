// src/main.ts

import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { Partitioners } from 'kafkajs';

async function bootstrap() {
  // Create the main NestJS app
  const app = await NestFactory.create(AppModule);

  // Connect Kafka microservice
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: {
        brokers: ['localhost:9092'], // Kafka broker list
      },
      producer: {
        createPartitioner: Partitioners.LegacyPartitioner,
      },
      consumer: {
        groupId: 'order-service-consumer', // Unique consumer group
      },
    },
  });

  // Start microservices first
  await app.startAllMicroservices();
  console.log('Kafka microservice is listening...');

  // Add swagger
  const config = new DocumentBuilder().build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  // Then start the HTTP server
  await app.listen(3000);
  console.log('HTTP server is running on http://localhost:3000');
}
bootstrap();
