import { Injectable } from '@angular/core';
import { ProductApiService } from '../../infrastructure/product-api.service';  // Asegúrate de importar el servicio
import { Product } from '../models/product.model';

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly repository: ProductApiService) {}

  execute(product: Product): Promise<Product> {
    console.log("Creando el producto en el caso de uso", product);
    return this.repository.create(product);  // Llamamos al repositorio para crear el producto
  }
}
