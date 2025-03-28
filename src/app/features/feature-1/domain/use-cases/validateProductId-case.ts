import { Injectable } from '@angular/core';
import { ProductApiService } from '../../infrastructure/product-api.service'; // Importamos el servicio ProductApiService

@Injectable()
export class VerifyProductIdUseCase {
  constructor(private readonly productApiService: ProductApiService) {}

  // Método para verificar si el ID es válido
  execute(id: string): Promise<boolean> {
    console.log("caso de uso id " + id);
    return this.productApiService.verifyProductId(id)  // Llamamos directamente al servicio para verificar el ID
      .then((response: boolean) => {
        return response;  // Retornamos el resultado de la verificación
      })
      .catch((error) => {
        console.error('Error al verificar el ID del producto caso de uso:', error);
        throw error;  // Lanzamos el error para que se maneje adecuadamente en el componente
      });
  }
}
