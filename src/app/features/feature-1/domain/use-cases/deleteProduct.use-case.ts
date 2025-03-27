import { Injectable, Inject } from '@angular/core';
import { ProductRepository } from '../repositories/product.repository';
import { ProductApiService } from '../../infrastructure/product-api.service';  // Asegúrate de importar la implementación

@Injectable()
export class DeleteProductUseCase {
  constructor(
    @Inject(ProductApiService) private readonly repository: ProductRepository // Inyectamos la implementación
  ) {}

  execute(productId: string): Promise<void> {
    return this.repository.delete(productId);  // Llamamos al repositorio para eliminar el producto
  }
}
