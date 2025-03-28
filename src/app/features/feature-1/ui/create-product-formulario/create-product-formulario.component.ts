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

  @Output() close = new EventEmitter<void>();
  @Output() submitForm = new EventEmitter<any>();

  form: FormGroup;
  idExistsError: string = '';  // Para manejar el error de ID

  constructor(
    private fb: FormBuilder,
    private createProductUseCase: CreateProductUseCase,
    private verifyProductIdUseCase: VerifyProductIdUseCase  // Inyectamos el caso de uso para la verificación del ID
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

      // Validación de fecha de liberación: Requerida
      date_release: ['', [Validators.required]],

      // Validación de fecha de revisión: Requerida y dependiente de la fecha de liberación
      date_revision: [{ value: '', disabled: true }, [Validators.required]]
    });

    // Cuando la fecha de liberación cambia, se actualiza la fecha de revisión
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

  // Ajustamos las horas de ambas fechas a 00:00:00 para evitar problemas con la zona horaria
  currentDate.setHours(0, 0, 0, 0); // Establecemos la hora a las 00:00:00
  selectedDate.setHours(0, 0, 0, 0); // Establecemos la hora a las 00:00:00

  // Convertimos ambas fechas a formato YYYY-MM-DD para compararlas solo en base a la fecha
  const currentDateString = currentDate.toLocaleDateString('en-CA'); // 'en-CA' es el formato YYYY-MM-DD
  const selectedDateString = selectedDate.toLocaleDateString('en-CA'); // 'en-CA' es el formato YYYY-MM-DD

  // Comparamos las fechas en formato YYYY-MM-DD
  return selectedDateString >= currentDateString ? null : { minDate: true };
}
dateMismatchValidator(control: AbstractControl) {
  const releaseDate = this.form?.get('date_release')?.value;
  const reviewDate = new Date(control.value);
  const releaseDateObj = new Date(releaseDate);
  return reviewDate.getFullYear() === releaseDateObj.getFullYear() + 1 ? null : { dateMismatch: true };
}



  // Método para verificar si el ID existe, se ejecuta cuando el campo pierde el foco
  /*checkIdExists(event: Event) {
    const id = (event.target as HTMLInputElement).value;

    // Validación de longitud mínima y máxima (3 a 10 caracteres)
    if (id.length < 3) {
      this.idExistsError = 'El ID debe tener al menos 3 caracteres.';
      this.form.get('id')?.setErrors({ minLength: true }); // Marca como error por longitud insuficiente
      return;  // Si no pasa la validación de longitud, no hacemos la consulta al backend
    }

    if (id.length > 10) {
      this.idExistsError = 'El ID no puede tener más de 10 caracteres.';
      this.form.get('id')?.setErrors({ maxLength: true }); // Marca como error por longitud excesiva
      return;  // Si no pasa la validación de longitud, no hacemos la consulta al backend
    }

    // Validación de formato (alfanumérico)
    const pattern = /^[a-zA-Z0-9]+$/;
    if (!pattern.test(id)) {
      this.idExistsError = 'El ID debe ser alfanumérico.';
      this.form.get('id')?.setErrors({ pattern: true }); // Marca como error por formato incorrecto
      return;  // Si no pasa la validación de formato, no hacemos la consulta al backend
    }

    // Si todas las validaciones anteriores pasaron, realizamos la consulta al backend
    this.verifyProductIdUseCase.execute(id)
      .then(isValid => {
        if (isValid) {
          // Si el ID ya existe en el backend
          this.idExistsError = 'El ID ya está en uso, por favor elige otro.';
          this.form.get('id')?.setErrors({ idExists: true }); // Marca el error de "ID ya existe"
        } else {
          // Si el ID es válido (no existe en el backend)
          this.idExistsError = '';  // Limpiar el mensaje de error
          this.form.get('id')?.setErrors(null); // Limpiar cualquier error previo
        }
      })
      .catch(() => {
        // En caso de error con la consulta al backend
        this.idExistsError = 'Error al verificar el ID. Intenta de nuevo más tarde.';
        this.form.get('id')?.setErrors({ backendError: true });  // Marcamos un error genérico por fallo en el backend
      });
  }*/
      checkIdExists(control: AbstractControl) {
        const id = control.value;

        if (id.length < 3 || id.length > 10 || !/^[a-zA-Z0-9]+$/.test(id)) {
          return null; // El validador se detiene si el ID no es válido por formato
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


  // Función para enviar el producto creado
  submit(): void {
    console.log('Formulario válido:', this.form.valid);

    // Para asegurarte de que el formulario es válido, debes usar el método `markAllAsTouched()` primero
    this.form.markAllAsTouched(); // Esto asegura que todos los campos se marquen como tocados antes de la validación

    // Esperar la validación asincrónica del campo 'id' (y cualquier otro campo que tenga validación asincrónica)
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
