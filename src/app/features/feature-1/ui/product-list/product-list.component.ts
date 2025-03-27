import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Product } from '../../domain/models/product.model';
import { ProductApiService } from '../../infrastructure/product-api.service';
import { CreateProductModalComponent } from '../create-product-modal/create-product-modal.component';
import { CreateProductUseCase } from '../../domain/use-cases/createProduct.use-case';
import { DeleteProductModalComponent } from '../delete-product-modal/delete-product-modal.component';
import { DeleteProductUseCase } from '../../domain/use-cases/deleteProduct.use-case';
// ...



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

  ngOnInit(): void {
    this.api.getAll()
      .then((data) => {
        this.products = data;
      })
      .catch((err) => {
        console.error('Error al obtener productos', err);
      });
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
    this.showModal = true; // 👈 activa el modal
  }

  onModalClose(): void {
    this.showModal = false; // 👈 cierra el modal
  }

  onModalSubmit(product: Product): void {
    // Aquí podrías llamar al caso de uso CreateProductUseCase
    console.log('Producto a guardar:', product);
    this.showModal = false;
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

  }
}
