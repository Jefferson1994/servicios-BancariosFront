import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateProductFormularioComponent } from './create-product-formulario.component';

describe('CreateProductFormularioComponent', () => {
  let component: CreateProductFormularioComponent;
  let fixture: ComponentFixture<CreateProductFormularioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateProductFormularioComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateProductFormularioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
