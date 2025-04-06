import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { CreateProductUseCase } from '../../domain/use-cases/createProduct.use-case'; // Asegúrate de importar el caso de uso
import { Product } from '../../domain/models/product.model'; // Asegúrate de importar el modelo de Producto
import Swal from 'sweetalert2';
import { VerifyProductIdUseCase } from '../../domain/use-cases/validateProductId-case'; // Importamos el caso de uso
import { Observable } from 'rxjs';


@Component({
  selector: 'app-create-product-formulario',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-product-formulario.component.html',
  styleUrls: ['./create-product-formulario.component.css'],
  providers: [CreateProductUseCase, VerifyProductIdUseCase]
})
export class CreateProductFormularioComponent {
  [x: string]: any;

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;
  idExistsError: string = '';  // Para manejar el error de ID

  constructor(
    private fb: FormBuilder,
    private createProductUseCase: CreateProductUseCase,
    private verifyProductIdUseCase: VerifyProductIdUseCase
) {
    this.form = this.fb.group({
      id: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(10),
        Validators.pattern('^[a-zA-Z0-9]+$')
      ], [this.checkIdExists.bind(this)]],

      name: ['', [Validators.required, Validators.minLength(5), Validators.maxLength(100)]],

      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(200)]],

      logo: ['', Validators.required],


      date_release: ['', [Validators.required]],
      date_revision: [{ value: '', disabled: true }, [Validators.required]]
    });


    this.form.get('date_release')?.valueChanges.subscribe(date => {
      if (date) {
        const oneYearLater = new Date(date);
        oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
        const dateRevision = oneYearLater.toISOString().substring(0, 10); // Formato YYYY-MM-DD
        this.form.get('date_revision')?.setValue(dateRevision); // Establecer la fecha de revisión
        this.form.get('date_revision')?.enable(); // Habilitar el campo
      }
    });
}

minDateValidator(control: AbstractControl) {
  const currentDate = new Date();
  const selectedDate = new Date(control.value);
  currentDate.setHours(0, 0, 0, 0);
  selectedDate.setHours(0, 0, 0, 0);
  // Convertimos ambas fechas a formato YYYY-MM-DD para compararlas solo en base a la fecha
  const currentDateString = currentDate.toLocaleDateString('en-CA');
  const selectedDateString = selectedDate.toLocaleDateString('en-CA');
  return selectedDateString >= currentDateString ? null : { minDate: true };
}
dateMismatchValidator(control: AbstractControl) {
  const releaseDate = this.form?.get('date_release')?.value;
  const reviewDate = new Date(control.value);
  const releaseDateObj = new Date(releaseDate);
  return reviewDate.getFullYear() === releaseDateObj.getFullYear() + 1 ? null : { dateMismatch: true };
}


 checkIdExists(control: AbstractControl) {
        const id = control.value;

        if (id.length < 3 || id.length > 10 || !/^[a-zA-Z0-9]+$/.test(id)) {
          return null;
        }

        return new Observable(observer => {
          this.verifyProductIdUseCase.execute(id)
            .then(isValid => {
              if (isValid) {
                observer.next({ idExists: true });
              } else {
                observer.next(null);
              }
              observer.complete();
            })
            .catch(() => {
              observer.next({ backendError: true });
              observer.complete();
            });
        });
      }



  submit(): void {
    console.log('Formulario válido:', this.form.valid);

    this.form.markAllAsTouched(); // Esto asegura que todos los campos se marquen como tocados antes de la validación

    // Esperar la validación asincrónica del campo 'id' (y cualquier otro campo que tenga validación asincrónica)

    this.waitForAsyncValidators().then(() => {
      if (this.form.valid) {
        const newProduct = this.form.value;

        // Llamar al caso de uso para crear el producto
        this.createProductUseCase.execute(newProduct)
          .then(response => {
            console.log('Producto creado:', response.data);
            this.submitForm.emit(response.data); // Emitimos el producto creado al componente padre

            // Mostrar mensaje de éxito con SweetAlert
            Swal.fire({
              icon: 'success',
              title: '¡Producto creado!',
              text: response.message,  // Mostramos el mensaje de éxito del backend
              confirmButtonText: 'Aceptar',
            });
            this.reset(); // Limpiar el formulario después de crear el producto
          })
          .catch(error => {
            console.error('Error al crear producto:', error);
            // Lógica de manejo de errores
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: 'Hubo un problema al crear el producto. Intenta de nuevo más tarde.',
              confirmButtonText: 'Aceptar',
            });
          });
      } else {
        // Si el formulario no es válido, mostramos un mensaje de advertencia
        Swal.fire({
          icon: 'warning',
          title: 'Campos incompletos',
          text: 'Por favor, completa todos los campos correctamente.',
          confirmButtonText: 'Aceptar',
        });
      }

    });

  }

  async waitForAsyncValidators() {
    const promises = Object.keys(this.form.controls).map(controlName => {
      return new Promise((resolve) => {
        const control = this.form.get(controlName);
        if (control && control.asyncValidator) {
          control.updateValueAndValidity({ onlySelf: true, emitEvent: false });
          resolve(true);  // Resolver una vez que se complete la validación asincrónica
        } else {
          resolve(true); // Si no hay validadores asíncronos, simplemente resolver
        }
      });
    });

    // Espera que todas las validaciones asíncronas se resuelvan
    await Promise.all(promises);
  }



  reset(): void {
    this.form.reset();  // Limpiamos el formulario
  }

  get f() {
    return this.form.controls;
  }
}
