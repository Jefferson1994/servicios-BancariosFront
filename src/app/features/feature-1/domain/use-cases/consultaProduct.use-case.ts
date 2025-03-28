import { Injectable } from '@angular/core';
import { ProductApiService } from '../../infrastructure/product-api.service';  // Importamos el servicio que interactúa con el backend
import { Product } from '../models/product.model';  // Importamos el modelo de Producto
import { ResponseProduct } from '../models/productResponse.model';  // Importamos la respuesta con el mensaje

@Injectable({
  providedIn: 'root'
})
export class GetProductByIdUseCase {

  constructor(private readonly repository: ProductApiService) {}

  execute(productId: string): Promise<Product> {
    return this.repository.getProductById(productId)
      .then(product => {
        // Aquí podrías agregar cualquier lógica de negocio adicional si fuera necesario
        return product;
      })
      .catch(error => {
        // Puedes agregar lógica para manejar el error, como lanzarlo o transformarlo
        console.error('Error en el caso de uso GetProductByIdUseCase:', error);
        throw new Error('No se pudo obtener el producto');
      });
  }

}
