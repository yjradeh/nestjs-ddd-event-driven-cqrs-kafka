// src/modules/product/application/commands/create-product.command.ts
export class CreateProductCommand {
  constructor(
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number,
  ) {}
}
