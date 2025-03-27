import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../domain/models/product.model';
import { ProductRepository } from '../domain/repositories/product.repository';

@Injectable({
  providedIn: 'root'
})
export class ProductApiService implements ProductRepository {
  private readonly baseUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) {}

  getAll(): Promise<Product[]> {
    return this.http.get<{ data: Product[] }>(this.baseUrl)
      .toPromise()
      .then(res => {
        if (!res?.data) throw new Error('Error al obtener productos');
        return res.data;
      });
  }

  create(product: Product): Promise<Product> {
    console.log("El objeto para crear: ", product);

    return this.http.post<{ data: Product }>(this.baseUrl, product)
      .toPromise()
      .then(res => {
        if (!res || !res.data) {
          throw new Error('Error al crear el producto. Respuesta incompleta.');
        }
        return res.data; // Devolvemos el producto creado
      })
      .catch(error => {
        console.error('Error al crear producto:', error);

        // Imprimimos detalles adicionales sobre el error en la consola
        if (error.status && error.status === 400) {
          console.error('Detalles del error 400:', error.error);  // Imprime el cuerpo de la respuesta del servidor
        }

        // Si el error es un error de red (status 0), imprimimos más detalles
        if (error.status === 0) {
          console.error('Error de red o servidor no disponible');
        }

        // Re-lanzamos el error para que sea capturado por el componente
        throw error;
      });
    }

    delete(id: string): Promise<void> {
      console.log("El ID del producto para eliminar: ", id);

      return this.http.delete<{ message: string }>(`${this.baseUrl}/${id}`)
        .toPromise()
        .then(res => {
          if (!res || !res.message) {
            throw new Error('Error al eliminar el producto. Respuesta incompleta.');
          }
          console.log('Producto eliminado con éxito:', res.message); // Puedes imprimir el mensaje de éxito
        })
        .catch(error => {
          console.error('Error al eliminar producto:', error);

          // Imprimimos detalles adicionales sobre el error en la consola
          if (error.status && error.status === 400) {
            console.error('Detalles del error 400:', error.error);  // Imprime el cuerpo de la respuesta del servidor
          }

          // Si el error es un error de red (status 0), imprimimos más detalles
          if (error.status === 0) {
            console.error('Error de red o servidor no disponible');
          }

          // Re-lanzamos el error para que sea capturado por el componente
          throw error;
        });
    }



}
