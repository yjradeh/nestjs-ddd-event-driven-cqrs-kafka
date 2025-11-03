import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { KafkaModule } from './infrastructure/kafka/kafka.module';
import { ProductRepositoryImpl } from './infrastructure/repositories/product.repository.imp';
import { PRODUCT_REPOSITORY } from './domain/repositories/product.repository';
import { CreateProductHandler } from './application/commands/handlers/create-product.handler';
import { ProductCreatedEventHandler } from './application/event-handlers/product-created.event-handler';
import { ProductController } from './infrastructure/controllers/product.controller';
import { ProductOrmEntity } from './infrastructure/entities/product.orm-entity';

@Module({
  imports: [
    // to be replaced in config or .env
    TypeOrmModule.forRoot({
      type: 'postgres', // Specify the database type
      host: 'localhost', // Your database host
      port: 5432, // Your database port (default for PostgreSQL)
      username: 'postgres', // Your PostgreSQL username
      password: '', // Your PostgreSQL password
      database: 'cooking-today', // The name of your database

      // Specify where NestJS can find your TypeORM entity files
      entities: [__dirname + '/**/*.orm-entity{.ts,.js}'],

      // For development, enables logging and automatically syncs the schema
      // **WARNING**: Do not use `synchronize: true` in production!
      synchronize: true,
    }),
    TypeOrmModule.forFeature([ProductOrmEntity]),
    KafkaModule,
    CqrsModule.forRoot(),
  ],
  providers: [
    ProductRepositoryImpl,
    {
      provide: PRODUCT_REPOSITORY,
      useClass: ProductRepositoryImpl,
    },
    CreateProductHandler,
    ProductCreatedEventHandler,
  ],
  controllers: [ProductController],
})
export class AppModule {}
