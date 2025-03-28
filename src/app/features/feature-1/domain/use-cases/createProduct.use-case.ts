import { Injectable } from '@angular/core';
import { ProductApiService } from '../../infrastructure/product-api.service';  // Importamos el servicio que interactúa con el backend
import { Product } from '../models/product.model';  // Importamos el modelo de Producto
import { ResponseProduct } from '../models/productResponse.model';  // Importamos la respuesta con el mensaje

@Injectable()
export class CreateProductUseCase {
  constructor(private readonly repository: ProductApiService) {}

  // Ejecutamos el caso de uso para crear un producto
  execute(product: Product): Promise<ResponseProduct> {
    console.log("Ejecutando el caso de uso para crear producto:", product);

    // Llamamos al método create de la infraestructura y le pasamos el producto
    return this.repository.create(product)
      .then((response: ResponseProduct) => {
        // Si la creación es exitosa, retornamos el ResponseProduct que contiene tanto el mensaje como el producto creado
        console.log('Producto creado con éxito:', response.message);
        return response;
      })
      .catch((error) => {
        // Si ocurre un error, lo lanzamos para que el componente lo maneje
        console.error('Error al crear el producto en el caso de uso:', error);
        throw error;  // Se vuelve a lanzar el error
      });
  }
}

