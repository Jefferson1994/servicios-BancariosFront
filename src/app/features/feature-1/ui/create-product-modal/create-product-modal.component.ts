import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Product } from '../../domain/models/product.model';
import {  GetProductByIdUseCase} from '../../domain/use-cases/consultaProduct.use-case'; // Asegúrate de importar el caso de uso
import {  UpdateProductUseCase} from '../../domain/use-cases/updateProduct.use-case';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // Importamos CommonModule y ReactiveFormsModule
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.css'],
   providers: [GetProductByIdUseCase,UpdateProductUseCase]
})



export class CreateProductModalComponent implements OnInit {

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();
  @Input() productId: string = '';  // Recibe el ID del producto
  @Output() refreshList = new EventEmitter<void>();

  form: FormGroup;
  product: Product | null = null;

  constructor(private fb: FormBuilder,private getProductByIdUseCase: GetProductByIdUseCase,private updateProductUseCase: UpdateProductUseCase) {
    // Creamos el formulario con los validadores correctos
    this.form = this.fb.group({
      id: ['', [Validators.required]],
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: false }]
    });
  }

  ngOnInit(): void {
    //console.log("ID recibido en el modal:", this.productId);

    // Llamamos al caso de uso para obtener el producto por su ID
    if (this.productId) {
      this.getProductByIdUseCase.execute(this.productId)
        .then(product => {
          this.product = product;
          this.form.patchValue({
            id: this.product.id,
            name: this.product.name,
            description: this.product.description,
            logo: this.product.logo,
            date_release: this.product.date_release,
            date_revision: this.product.date_revision
          });

          this.form.get('id')?.disable();
        })
        .catch(error => {
          console.error('Error al obtener el producto:', error);
        });
    }
  }


  submit(): void {
    if (this.form.valid) {

      const updatedProduct = this.form.value;

      if (!updatedProduct.id2) {

        if (this.product) {
          updatedProduct.id2 = this.product.id;
          //console.log('ID2 recuperado directamente desde this.product:', updatedProduct.id2);
        } else {
          //console.error('No se pudo recuperar el ID2, el producto no está disponible');
          return;
        }
      }


      if (!updatedProduct.id2) {
        console.error('El ID2 sigue siendo undefined');
        return;
      }

      // Llamamos al caso de uso para actualizar el producto con los nuevos datos
      this.updateProductUseCase.execute(updatedProduct.id2, updatedProduct)
        .then(updatedProduct => {
          console.log('Producto actualizado:', updatedProduct);


          Swal.fire({
            icon: 'success',
            title: 'Producto actualizado',
            text: 'El producto se ha actualizado correctamente.',
            confirmButtonText: 'Aceptar',
          }).then(() => {

            this.closeModal();
            this.refreshList.emit();
          });
        })
        .catch(error => {
          console.error('Error al actualizar el producto:', error);

          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Hubo un problema al actualizar el producto. Intenta nuevamente.',
            confirmButtonText: 'Aceptar'
          });
        });
    }
  }



  closeModal(): void {
    this.close.emit();
  }


  reset(): void {
    this.form.reset();
  }


  get f() {
    return this.form.controls;
  }
}

