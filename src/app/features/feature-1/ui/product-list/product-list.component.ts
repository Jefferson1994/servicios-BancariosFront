import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../domain/models/product.model';
import { ProductApiService } from '../../infrastructure/product-api.service';
import { CreateProductModalComponent } from '../create-product-modal/create-product-modal.component';
import { CreateProductUseCase } from '../../domain/use-cases/createProduct.use-case';
import { DeleteProductModalComponent } from '../delete-product-modal/delete-product-modal.component';
import { DeleteProductUseCase } from '../../domain/use-cases/deleteProduct.use-case';
import { Router } from '@angular/router';



@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, CreateProductModalComponent,DeleteProductModalComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
  providers: [CreateProductUseCase, ProductApiService,DeleteProductUseCase]

})
export class ProductListComponent implements OnInit {
  private readonly api = inject(ProductApiService);
  showModal = false; // 👈 bandera para mostrar u ocultar el modal
  showDeleteModal = false;
  products: Product[] = [];
  searchTerm = '';
  limit = 5;
  selectedProductId: string = '';  // Definir la propiedad selectedProductId
  selectedProductName: string = '';  // Definir la propiedad selectedProductName
  errorMessage: string = '';
  isLoading: boolean = true;
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.isLoading = true;  // Mostrar los skeletons

    // Simulamos un retraso de 1 segundo
    setTimeout(() => {
      this.api.getAll()
        .then((data) => {
          this.products = data;
          this.isLoading = false;  // Ocultar los skeletons y mostrar la tabla
          this.errorMessage = '';  // Limpiamos el mensaje de error si todo va bien
        })
        .catch((err) => {
          console.error('Error al obtener productos', err);

          // Mostrar el mensaje de error que devuelve el backend
          if (err && err.error && err.error.message) {
            this.errorMessage = err.error.message;  // Asignamos el mensaje del backend
          } else {
            // Si no hay mensaje de error en la respuesta, mostrar un error genérico
            this.errorMessage = 'Hubo un problema al cargar los productos. Por favor, intenta nuevamente más tarde.';
          }

          this.isLoading = false;  // Asegúrate de ocultar los skeletons en caso de error
        });
    }, 1000); // El retraso de 1 segundo
  }


  get filteredProducts(): Product[] {
    return this.products.filter(p =>
      p.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      p.id.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }


  get paginatedProducts(): Product[] {
    return this.filteredProducts.slice(0, this.limit);
  }

  onSearch() {
    // Se llama automáticamente con [(ngModel)]
  }

  onLimitChange() {
    // Ya aplica automáticamente el filtro por paginado
  }



  onAddProduct(): void {
    console.log("click en boton abrir modal")
    //this.showModal = true; // 👈 activa el modal

    this.router.navigate(['/crear-producto']);
  }

  onModalClose(): void {
    this.showModal = false; // 👈 cierra el modal
  }

  onModalSubmit(newProduct: Product): void {

    this.loadProducts();
  }

  onDelete(productId: string, productName: string): void {
    console.log('Producto a eliminar con ID:', productId);  // Recuperamos el ID
    this.selectedProductId = productId;  // Asignamos el ID del producto seleccionado
    this.selectedProductName = productName;  // Asignamos el nombre del producto
    this.showDeleteModal = true;  // Mostramos el modal de eliminación
  }


  onDeleteModalClose(): void {
    this.showDeleteModal = false; // 👈 cierra el modal
  }


  onConfirmDelete(): void {
    this.loadProducts();  // Recargamos los productos después de eliminar uno
    this.showDeleteModal = false;  // Cerramos el modal
  }

  onProductDeleted(): void {
    this.loadProducts(); // Recargamos la lista después de la eliminación
  }


}
