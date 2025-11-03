// src/modules/product/infrastructure/controllers/dtos/create-product.dto.ts

import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    example: 'Awesome Gadgett', // 👈 Example for this property
    description: 'The name of the product.',
  })
  name: string;

  @ApiProperty({
    example: 49.99,
    description: 'The price of the product.',
  })
  price: number;

  @ApiProperty({
    example: 100,
    description: 'The current stock level.',
  })
  stock: number;
}
