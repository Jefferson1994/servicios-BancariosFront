import { Product } from '../models/product.model';
import { ResponseProduct } from '../models/productResponse.model';

export interface ProductRepository {
  getAll(): Promise<Product[]>;
  create(product: Product): Promise<ResponseProduct>;
  delete(id: string): Promise<void>;
  verifyProductId(id: string): Promise<boolean>;
  getProductById(id: string): Promise<Product>;
  update(id: string, updatedProduct: Product): Promise<Product>;
}

