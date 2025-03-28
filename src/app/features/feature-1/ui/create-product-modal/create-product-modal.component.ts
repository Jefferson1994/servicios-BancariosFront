import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
//import { CreateProductUseCase } from '../../domain/use-cases/createProduct.use-case'; // Asegúrate de importar el caso de uso
//import { Product } from '../../domain/models/product.model'; // Asegúrate de importar el modelo de Producto

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
    private fb: FormBuilder
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



  submit(){
    
  }  // Función para cerrar el modal
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
