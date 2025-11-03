// src/modules/product/infrastructure/controllers/product.controller.ts
import { Body, Controller, Post } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { CreateProductCommand } from '../../application/commands/create-product.command';
import { CreateProductDto } from './dtos/create-product.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('products')
@ApiTags('Products')
export class ProductController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post()
  @ApiOperation({ summary: 'Create a new user account' })
  @ApiResponse({
    status: 201,
    description: 'The user has been successfully created.',
  })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  async createProduct(@Body() dto: CreateProductDto) {
    await this.commandBus.execute(
      new CreateProductCommand(dto.name, dto.price, dto.stock),
    );
    return { message: 'Product creation initiated' };
  }
}
