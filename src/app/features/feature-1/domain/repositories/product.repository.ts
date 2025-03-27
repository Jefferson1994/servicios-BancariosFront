import { Product } from '../models/product.model';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  create(product: Product): Promise<Product>;
  delete(id: string): Promise<void>; 
}

