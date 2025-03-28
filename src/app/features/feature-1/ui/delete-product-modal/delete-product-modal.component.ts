import { Component, EventEmitter, Input, Output } from '@angular/core';
import { DeleteProductUseCase } from '../../domain/use-cases/deleteProduct.use-case'; // Asegúrate de importar el caso de uso
import { ProductApiService } from '../../infrastructure/product-api.service';


@Component({
  selector: 'app-delete-product-modal',
  standalone: true,
  templateUrl: './delete-product-modal.component.html',
  styleUrls: ['./delete-product-modal.component.css'],
})
export class DeleteProductModalComponent {
  @Input() productName: string = ''; // Recibe el nombre del producto
  @Input() productId: string = '';   // Recibe el ID del producto
  @Output() close = new EventEmitter<void>();
  @Output() confirmDelete = new EventEmitter<string>(); // Emite el ID del producto para eliminar
  @Output() productDeleted = new EventEmitter<void>();  // Emite el evento de eliminación

  constructor(
    private productApiService: ProductApiService,
    private deleteProductUseCase: DeleteProductUseCase
  ) {}

  closeModal(): void {
    this.close.emit();
  }

  confirmDeleteProduct(): void {
    //console.log("click en eliminar producto por id"+this.productId)

    this.onConfirmDelete(this.productId);
    this.productDeleted.emit();

  }



  onConfirmDelete(productId: string): void {
    //console.log('Confirmando eliminación del producto con ID:', productId);

    // Llamamos al caso de uso para eliminar el producto
    this.deleteProductUseCase.execute(productId)
      .then(() => {
        //console.log('Producto eliminado con éxito');
        // Mostramos un mensaje de éxito
        alert('El producto ha sido eliminado con éxito.');
        this.productDeleted.emit();
        this.closeModal();
      })
      .catch((error) => {
        console.error('Error al eliminar el producto:', error);

        // Si el error tiene detalles específicos (por ejemplo, errores del servidor)
        if (error && error.errors) {
          const errorMessages = error.errors.map((err: any) => {
            // Accedemos a los detalles de cada error (por ejemplo, 'message')
            const fieldError = Object.values(err.constraints).join(', ');
            return `${err.property}: ${fieldError}`;
          }).join('\n');

          // Mostramos el error en un alert
          alert(`Hubo un problema al eliminar el producto:\n${errorMessages}`);
        } else {
          // Si no se encuentra la propiedad 'errors', mostramos un mensaje genérico
          alert('Hubo un problema al eliminar el producto. Por favor, inténtalo nuevamente.');
        }
      });
  }




}
