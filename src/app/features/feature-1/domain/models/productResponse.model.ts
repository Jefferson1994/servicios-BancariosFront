import { Product } from './product.model';

export interface ResponseProduct {
  message: string;  // El mensaje que la API devuelve
  data: Product;    // El producto creado
}
