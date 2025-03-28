import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Product } from '../domain/models/product.model';
import { ProductRepository } from '../domain/repositories/product.repository';
import { ResponseProduct } from '../domain/models/productResponse.model';
@Injectable({
  providedIn: 'root'
})
export class ProductApiService implements ProductRepository {
  private readonly baseUrl = 'http://localhost:3002/bp/products';

  constructor(private http: HttpClient) { }

  getAll(): Promise<Product[]> {
    return this.http.get<{ data: Product[] }>(this.baseUrl)
      .toPromise()
      .then(res => {
        if (!res?.data) throw new Error('Error al obtener productos');
        return res.data;
      });
  }


  create(product: Product): Promise<ResponseProduct> {
    console.log("El objeto para crear: ", product);

    return this.http
      .post<ResponseProduct>(this.baseUrl, product)  // Esperamos una respuesta de tipo ResponseProduct
      .toPromise()
      .then(res => {
        // Verificamos si hay datos en la respuesta
        if (!res || !res.data) {
          throw new Error('Error al crear el producto. Respuesta incompleta.');
        }

        // Mostramos el mensaje del backend
        console.log('Mensaje del backend:', res.message);  // Ejemplo: "Product added successfully"

        // Devolvemos el ResponseProduct completo
        return res;  // Regresamos el objeto completo, que incluye tanto el mensaje como el producto
      })
      .catch(error => {
        console.error('Error al crear producto:', error);

        // Si el error es un BadRequest (400), mostramos el error con los detalles
        if (error.status && error.status === 400) {
          console.error('Detalles del error 400:', error.error);  // Muestra los errores que devuelve el servidor
        }

        // Si hay error de red (status 0), mostramos el mensaje correspondiente
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

  verifyProductId(id: string): Promise<boolean> {
    const url = `${this.baseUrl}/verification/${id}`;
    console.log("La URL que se está llamando: ", url);  // Verifica la URL completa

    return this.http.get<{ valid: boolean }>(url)
      .toPromise()
      .then(res => {
        console.log("Respuesta del servidor: ", res);  // Imprime la respuesta completa del servidor

        // Verifica si res es un valor booleano directamente, ya que el servidor podría estar enviando solo true o false
        if (typeof res === 'boolean') {
          return res;  // Si es un booleano, simplemente lo devolvemos
        }

        // Si la respuesta tiene un formato diferente, aseguramos que tenga la propiedad "valid"
        if (res && res.valid !== undefined) {
          return res.valid;
        }

        throw new Error('Respuesta inesperada del servidor');  // Si no tiene "valid", lanzamos un error
      })
      .catch(error => {
        console.error('Error al verificar el ID:', error);

        // Si el servidor no está disponible o hay un error de red
        if (error.status === 0) {
          throw new Error('El servidor no está disponible. Inténtalo de nuevo más tarde.');
        }

        // En caso de otros errores, también lanzamos un mensaje genérico
        throw new Error('Hubo un problema al verificar el ID. Inténtalo de nuevo más tarde.');
      });
  }

  getProductById(productId: string): Promise<Product> {
    const url = `${this.baseUrl}/${productId}`;  // URL con el ID del producto
    console.log("La URL construida: " + url);  // Verificamos la URL construida

    return this.http.get<Product>(url)  // Esperamos que la respuesta sea directamente un objeto Product
      .toPromise()
      .then(res => {
        console.log('Respuesta de la API:', res);  // Verificamos que la respuesta sea la esperada
        if (!res) throw new Error('Error al obtener el producto');  // Si la respuesta no es válida
        return res;  // Devolvemos directamente el objeto del producto
      })
      .catch(error => {
        console.error('Error en la solicitud HTTP:', error);  // Verificamos el error
        throw new Error('Error al obtener el producto');
      });
  }

  // En la capa de infraestructura
  update(id: string, updatedProduct: Product): Promise<Product> {
    const url = `${this.baseUrl}/${id}`;  
    console.log('Actualizando producto con ID:', id);
    console.log('Datos a actualizar:', updatedProduct);

    return this.http.put<{ data: Product }>(url, updatedProduct)
      .toPromise()
      .then(res => {
        if (!res?.data) throw new Error('Error al actualizar el producto');
        return res.data;  // Devolvemos el producto actualizado
      })
      .catch(error => {
        console.error('Error al actualizar producto:', error);
        throw new Error('Error al actualizar el producto');
      });
  }










}
