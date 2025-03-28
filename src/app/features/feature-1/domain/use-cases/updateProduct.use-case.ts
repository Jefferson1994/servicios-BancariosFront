// Caso de uso para actualizar un producto

import { Injectable } from '@angular/core';
import { ProductApiService } from '../../infrastructure/product-api.service';  // Importamos el servicio que interactúa con el backend
import { Product } from '../models/product.model';  // Importamos el modelo de Producto
import { ResponseProduct } from '../models/productResponse.model';  // Importamos la respuesta con el mensaje

@Injectable()
export class UpdateProductUseCase {
  constructor(private readonly repository: ProductApiService) {}

  // Ejecutamos el caso de uso para crear un producto
  execute(id: string, updatedProduct: Product): Promise<Product> {
    console.log('Ejecutando el caso de uso para actualizar el producto:', updatedProduct);

    // Llamamos al método de la infraestructura para actualizar el producto
    return this.repository.update(id, updatedProduct)
      .then((response: Product) => {
        // Si la actualización es exitosa, retornamos el producto actualizado
        console.log('Producto actualizado con éxito:', response);
        return response;
      })
      .catch((error) => {
        // Si ocurre un error, lo lanzamos para que el componente lo maneje
        console.error('Error al actualizar el producto en el caso de uso:', error);
        throw error;  // Se vuelve a lanzar el error
      });
  }
}

