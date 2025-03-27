import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CreateProductUseCase } from '../../domain/use-cases/createProduct.use-case'; // Asegúrate de importar el caso de uso
import { Product } from '../../domain/models/product.model'; // Asegúrate de importar el modelo de Producto

@Component({
  selector: 'app-create-product-modal',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],  // Importamos CommonModule y ReactiveFormsModule
  templateUrl: './create-product-modal.component.html',
  styleUrls: ['./create-product-modal.component.css'],
})
export class CreateProductModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private createProductUseCase: CreateProductUseCase // Inyectamos el caso de uso
  ) {
    // Creamos el formulario con los validadores correctos
    this.form = this.fb.group({
      id: ['', [Validators.required]],  // Validación de solo requerir que esté presente, quitamos el patrón
      name: ['', Validators.required],
      description: ['', Validators.required],
      logo: ['', Validators.required],
      date_release: ['', Validators.required],
      date_revision: [{ value: '', disabled: false }]
    });
  }

  // Función para enviar el producto creado
  submit(): void {
    if (this.form.valid) {
      const newProduct: Product = this.form.value;  // Crear el objeto Producto

      // Llamamos al caso de uso para crear el producto
      this.createProductUseCase.execute(newProduct)
        .then(product => {
          console.log('Producto creado:', product);
          this.submitForm.emit(product); // Emitimos el producto creado al componente padre
          this.closeModal();  // Cerramos el modal
        })
        .catch(error => {
          console.error('Error al crear producto:', error);

          if (error.status === 400) {
            console.error('Detalles del error:', error.error.errors); // Imprime los errores del servidor
          }
        });
    } else {
      this.form.markAllAsTouched(); // Mostrar los errores de validación
    }
  }


  // Función para cerrar el modal
  closeModal(): void {
    this.close.emit();
  }

  // Función para reiniciar el formulario
  reset(): void {
    this.form.reset();  // Limpiamos el formulario
  }

  // Getter para acceder a los controles del formulario
  get f() {
    return this.form.controls;
  }
}
