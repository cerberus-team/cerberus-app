import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule } from '@angular/material';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

import { NewVolunteerFormComponent } from './new-volunteer-form.component';

describe('NewVolunteerFormComponent', () => {
  let component: NewVolunteerFormComponent;
  let fixture: ComponentFixture<NewVolunteerFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NewVolunteerFormComponent],
      imports: [
        NoopAnimationsModule,
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatInputModule,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewVolunteerFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('is created', () => {
    expect(component).toBeTruthy();
  });

  ['firstName', 'lastName', 'petName'].forEach(form => {
    describe((`${form} control`), () => {
      let control: AbstractControl;

      beforeEach(async(() => {
        control = component.formGroup.controls[form];
      }));

      it('validates requirement', (() => {
        const errors = control.errors || {};
        expect(control.valid).toBeFalsy();
        expect(errors['required']).toBeTruthy();
      }));

      it('validates min length', (() => {
        control.setValue('C');
        const errors = control.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['minlength']).toBeTruthy();
      }));

      it('validates max length', (() => {
        control.setValue('Quinquagintaquadringentilliards');
        const errors = control.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['maxlength']).toBeTruthy();
      }));

      it('validates pattern', (() => {
        control.setValue('!@#$%^&*()_+');
        const errors = control.errors || {};
        expect(errors['required']).toBeFalsy();
        expect(errors['pattern']).toBeTruthy();
      }));

      it('accepts a valid name', (() => {
        control.setValue('Cerberus');
        expect(control.valid).toBeTruthy();
        expect(control.errors).toBeFalsy();
      }));

      it('clears the form on submit', (() => {
        control.setValue('Cerberus');
        component.submit();
        expect(control.value).toBeFalsy();
      }));
    });
  })
});
