# DDD — Event‑Driven CQRS with Kafka (NestJS)

Production‑ready skeleton demonstrating Domain‑Driven Design (DDD), CQRS, and event‑driven architecture on NestJS with Kafka and PostgreSQL/TypeORM.

- Command side exposes HTTP endpoints (e.g., create Product) which emit domain events
- Domain events are published to Kafka and can be handled asynchronously
- Swagger docs available at /docs


## Key Features

- DDD with explicit domain entities, repositories, and domain events
- CQRS using @nestjs/cqrs (commands, handlers, event handlers)
- Kafka integration (publish domain events to topic domain-events)
- PostgreSQL via TypeORM for persistence (Product aggregate)
- OpenAPI (Swagger) documentation


## Tech Stack

- Node.js + NestJS 11
- TypeScript
- @nestjs/cqrs
- Kafka (kafkajs, Nest microservices)
- PostgreSQL + TypeORM
- Swagger (OpenAPI)


## Project Structure

- src/app.module.ts — Root module wiring TypeORM, CQRS, and Kafka
- src/main.ts — Boots HTTP app and Kafka microservice, sets up Swagger at /docs
- src/domain — Pure domain (entities, events, repositories/contracts)
- src/application — Use cases (commands, command handlers, event handlers)
- src/infrastructure — Adapters (controllers, Kafka publisher/consumer, ORM entities, repository impl)


## Prerequisites

- Node.js 18+ and pnpm
- PostgreSQL running locally
  - Default config in code: host=localhost, port=5432, username=postgres, password=, database=cooking-today
- Kafka broker reachable at localhost:9092
  - Local single‑node Kafka (e.g. Docker) is fine

Example (Docker) to start Kafka quickly:

- Confluent Platform quickstart or any local Kafka setup exposing localhost:9092


## Installation

- pnpm install


## Configuration

Current defaults are hard‑coded for simplicity (replace later with env/config if needed):

- Kafka client/broker: src/main.ts and src/infrastructure/kafka/kafka.module.ts
  - brokers: ['localhost:9092']
  - consumer groupId: order-service-consumer
  - clientId: order-system
- Database: src/app.module.ts TypeOrmModule.forRoot
  - host=localhost, port=5432, username=postgres, password=, database=cooking-today

Update these values in code or introduce configuration (.env) as needed for your environment.


## Running Locally

- Development (watch): pnpm run start:dev
- Regular dev: pnpm run start
- Production build: pnpm run build then pnpm run start:prod

The app starts:
- HTTP server: http://localhost:3000
- Swagger UI: http://localhost:3000/docs
- Kafka microservice connects and listens using group order-service-consumer


## API Usage (Command Side)

- Create Product
  - POST /products
  - Body:
    {
      "name": "Coffee Mug",
      "price": 12.99,
      "stock": 100
    }
  - Response: { "message": "Product creation initiated" }
  - Behavior: Creates Product aggregate, persists via repository, publishes ProductCreatedEvent to Kafka topic domain-events

Swagger docs show the endpoint and DTO; open http://localhost:3000/docs


## Kafka

- Topic: domain-events
- Publisher: src/infrastructure/kafka/kafka-event-publisher.ts
  - Sends messages with headers:
    - eventType: e.g., ProductCreatedEvent
    - publishedTime: ISO timestamp
  - Key: aggregate id
- Consumer: src/infrastructure/kafka/domain-events.controller.ts
  - Uses @MessagePattern('domain-events') to consume
  - Routes by header eventType and invokes corresponding handler (e.g., ProductCreatedEventHandler)


## Testing

- Unit tests: pnpm run test
- Watch: pnpm run test:watch
- Coverage: pnpm run test:cov


## Notes

- This repository focuses on the command side and event publishing. Extend with query side/read models as needed.
- Consider extracting configuration to environment variables for production.


## License

UNLICENSED (see package.json)
