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
  showModal = false; //  bandera para manera el modal
  showDeleteModal = false;
  products: Product[] = [];
  searchTerm = '';
  limit = 5;
  selectedProductId: string = '';
  selectedProductName: string = '';
  errorMessage: string = '';
  isLoading: boolean = true; //variable para manejar el skeletons
  private readonly router = inject(Router);

  ngOnInit(): void {
    this.loadProducts();
  }

  reloadProductList(): void {
    this.loadProducts();
  }

  deletereloadProductList(): void {
    this.loadProducts();
  }


  loadProducts(): void {
    this.isLoading = true;
    //para mostra el skeletons con un segundo
    setTimeout(() => {
      this.api.getAll()
        .then((data) => {
          this.products = data;
          this.isLoading = false;
          this.errorMessage = '';
        })
        .catch((err) => {
          console.error('Error al obtener productos', err);

          // Mostrar el mensaje de error que devuelve el backend
          if (err && err.error && err.error.message) {
            this.errorMessage = err.error.message;
          } else {
            //  mostrar un error genérico
            this.errorMessage = 'Hubo un problema al cargar los productos. Por favor, intenta nuevamente más tarde.';
          }

          this.isLoading = false;
        });
    }, 1000);
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





  onAddProduct(): void {
    console.log("click en boton abrir modal")
    this.router.navigate(['/crear-producto']);// navegar a la ruta oara crea el producto
  }


  onEditProducto(productId: string): void {
    console.log("click en boton abrir modal"+productId)
    this.selectedProductId = productId;
    this.showModal = true;
  }

  onModalClose(): void {
    this.showModal = false;
  }

  onModalSubmit(newProduct: Product): void {

    this.loadProducts();// metodo para cargar la lista de productos
  }

  onDelete(productId: string, productName: string): void {
    //console.log('Producto a eliminar con ID:', productId);
    this.selectedProductId = productId;// variables para comunicarme con el modal eliminar
    this.selectedProductName = productName;
    this.showDeleteModal = true;
  }


  onDeleteModalClose(): void {
    this.showDeleteModal = false;
  }


  onConfirmDelete(): void {
    this.loadProducts();
    this.showDeleteModal = false;
  }

  onProductDeleted(): void {
    this.loadProducts();
  }


}
