import { inject } from '@angular/core';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../models/product.model';

export class GetAllProductsUseCase {
  constructor(private readonly repository: ProductRepository) {}

  execute(): Promise<Product[]> {
    console.log("en el caso de uso")
    return this.repository.getAll();
  }
}





