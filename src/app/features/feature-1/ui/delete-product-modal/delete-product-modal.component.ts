import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeleteProductUseCase } from '../../domain/use-cases/deleteProduct.use-case'; // Asegúrate de importar el caso de uso
import { ProductApiService } from '../../infrastructure/product-api.service';


@Component({
  selector: 'app-delete-product-modal',
  standalone: true,  // Hacerlo standalone
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css'],
})
export class DeleteProductModalComponent {
  @Input() productName: string = ''; // Recibe el nombre del producto
  @Input() productId: string = '';   // Recibe el ID del producto
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<string>(); // Emite el ID del producto para eliminar

  constructor(
    private productApiService: ProductApiService,
    private deleteProductUseCase: DeleteProductUseCase
  ) {}

  closeModal(): void {
    this.close.emit();  // Cierra el modal
  }

  confirmDeleteProduct(): void {
    console.log("click en eliminar producto por id"+this.productId)
    //this.confirmDelete.emit(this.productId); // Emite el ID del producto para confirmación
    this.onConfirmDelete(this.productId);
      // Cierra el modal
  }

  onConfirmDelete(productId: string): void {
    console.log('Confirmando eliminación del producto con ID:', productId);

    // Llamamos al caso de uso para eliminar el producto
    this.deleteProductUseCase.execute(productId)
      .then(() => {
        console.log('Producto eliminado con éxito');
        //this.loadProducts(); // Recargamos la lista de productos
        //this.showDeleteModal = false; // Cerramos el modal
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);
      });
  }



}
