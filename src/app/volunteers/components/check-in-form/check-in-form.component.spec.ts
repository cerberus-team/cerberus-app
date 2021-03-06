import { DebugElement } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { AbstractControl, FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatInputModule, MatRadioModule } from '@angular/material';
import { By } from '@angular/platform-browser';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { MockComponent } from 'ng2-mock-component';
import { createMockVisits } from '../../../../mocks/objects/visit.mock';
import { createMockVolunteers } from '../../../../mocks/objects/volunteer.mock';
import { CheckInFormComponent } from './check-in-form.component';
import any = jasmine.any;
import arrayContaining = jasmine.arrayContaining;
import objectContaining = jasmine.objectContaining;

describe('CheckInFormComponent', () => {
  let component: CheckInFormComponent;
  let fixture: ComponentFixture<CheckInFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckInFormComponent,
        MockComponent({ selector: 'app-signature-field' }),
      ],
      imports: [
        MatAutocompleteModule,
        MatInputModule,
        MatRadioModule,
        NoopAnimationsModule,
        ReactiveFormsModule,
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInFormComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should create the form group', async(() => {
    const group = spyOn(TestBed.get(FormBuilder), 'group').and.callThrough();
    fixture.detectChanges();
    expect(group).toHaveBeenCalledWith(objectContaining({
      name: any(Array),
      petName: any(Array),
      signature: any(Array),
    }));
  }));

  it('should subscribe to name control value changes', async(() => {
    const value = 'test';
    const onNameChange = spyOn(component, 'onNameChange');
    component.subscribeToNameChanges(cold('--a|', { a: value }));
    getTestScheduler().flush(); // flush the observables
    expect(onNameChange).toHaveBeenCalledWith(value);
  }));

  it('should clear the form (active visit, selected volunteer, matches, and signature) and update petName control validity on resetting the form', async(() => {
    fixture.detectChanges();
    const volunteer = createMockVolunteers()[0];
    component.activeVisit = createMockVisits()[0];
    component.selectedVolunteer = volunteer;
    component.matches = [volunteer];
    const clearSignature = spyOn(component, 'clearSignature');
    const updateValueAndValidity = spyOn(component.formGroup.controls['petName'], 'updateValueAndValidity');
    component.resetForm();
    expect(component.activeVisit).toBeNull();
    expect(component.selectedVolunteer).toBeNull();
    expect(component.matches).toEqual([]);
    expect(clearSignature).toHaveBeenCalled();
    expect(updateValueAndValidity).toHaveBeenCalled();
  }));

  it('should do nothing on name changes with a falsy value', async(() => {
    component.onNameChange('');
    expect(component.autocompleteNames).toBeFalsy();
  }));

  it('should update the autocomplete names on name changes', async(() => {
    spyOn(component, 'resetForm').and.stub();
    component.volunteers = createMockVolunteers();
    component.onNameChange('Ted');
    expect(component.autocompleteNames).toEqual(arrayContaining(['Ted Mader']));
  }));

  it('should reset the form on name changes', async(() => {
    const resetForm = spyOn(component, 'resetForm');
    component.volunteers = createMockVolunteers();
    component.onNameChange('Ted');
    expect(resetForm).toHaveBeenCalled();
  }));

  describe('name selection', () => {
    let nameAutocomplete: DebugElement;

    beforeEach(() => {
      component.volunteers = createMockVolunteers();
      fixture.detectChanges();
      nameAutocomplete = fixture.debugElement.query(By.css('#name-autocomplete'));
    });

    it('should find matching volunteers and select the volunteer if there is only one match', async(() => {
      const selectVolunteer = spyOn(component, 'selectVolunteer');
      nameAutocomplete.triggerEventHandler('optionSelected', { option: { value: 'Hillary Lynn' } });
      const expected = component.volunteers[1];
      expect(component.matches).toEqual(arrayContaining([expected]));
      expect(selectVolunteer).toHaveBeenCalledWith(expected);
    }));

    it('should find matching volunteers and not select the volunteer if there is more than one match', async(() => {
      const selectVolunteer = spyOn(component, 'selectVolunteer');
      nameAutocomplete.triggerEventHandler('optionSelected', { option: { value: 'Ted Mader' } });
      expect(component.matches).toEqual(arrayContaining([
        component.volunteers[0],
        component.volunteers[2],
      ]));
      expect(selectVolunteer).not.toHaveBeenCalled();
    }));

    it('should update name control validity', async(() => {
      const updateValueAndValidity = spyOn(component.formGroup.controls['name'], 'updateValueAndValidity');
      nameAutocomplete.triggerEventHandler('optionSelected', { option: { value: 'Ted Mader' } });
      expect(updateValueAndValidity).toHaveBeenCalled();
    }));
  });

  describe('pet name selection', () => {
    let petNameRadioGroup: DebugElement;

    beforeEach(() => {
      component.matches = createMockVolunteers(); // More than one match displays pet name radio group
      fixture.detectChanges();
      petNameRadioGroup = fixture.debugElement.query(By.css('#pet-name-radio-group'));
    });

    it('should select a volunteer on pet name selection', async(() => {
      const selectVolunteer = spyOn(component, 'selectVolunteer');
      const value = 'Bandit';
      petNameRadioGroup.triggerEventHandler('change', { value });
      expect(selectVolunteer).toHaveBeenCalledWith(value);
    }));

    it('should clear the signature on pet name selection', async(() => {
      spyOn(component, 'selectVolunteer');
      const clearSignature = spyOn(component, 'clearSignature');
      fixture.detectChanges();
      petNameRadioGroup.triggerEventHandler('change', {});
      expect(clearSignature).toHaveBeenCalled();
    }));

    it('should update petName control validity on pet name selection', async(() => {
      spyOn(component, 'selectVolunteer');
      const updateValueAndValidity = spyOn(component.formGroup.controls['petName'], 'updateValueAndValidity');
      fixture.detectChanges();
      petNameRadioGroup.triggerEventHandler('change', {});
      expect(updateValueAndValidity).toHaveBeenCalled();
    }));
  });

  it('should set the selected volunteer and check for active visits', async(() => {
    const volunteer = createMockVolunteers()[0];
    const visits = createMockVisits();
    component.visits = createMockVisits(visits);
    component.selectVolunteer(volunteer);
    expect(component.selectedVolunteer).toEqual(volunteer);
    expect(component.activeVisit).toEqual(visits[3]);
  }));

  it('should clear the signature', async(() => {
    fixture.detectChanges();
    const reset = spyOn(component.formGroup.controls['signature'], 'reset');
    component.clearSignature();
    expect(reset).toHaveBeenCalled();
  }));

  it('should emit a checkIn event on submit if there is no active visit and a volunteer is selected', () => {
    const visit = createMockVisits()[0];
    fixture.detectChanges();
    component.formGroup.controls['signature'].setValue(visit.signature);
    spyOn(component.checkIn, 'emit');
    component.selectedVolunteer = createMockVolunteers()[0];
    component.submit();
    expect(component.checkIn.emit).toHaveBeenCalled();
  });

  it('should emit a checkOut event on submit if there is an active visit', () => {
    spyOn(component.checkOut, 'emit');
    component.selectedVolunteer = createMockVolunteers()[0];
    component.activeVisit = createMockVisits()[0];
    component.submit();
    expect(component.checkOut.emit).toHaveBeenCalled();
  });

  describe('name control', () => {
    let nameControl: AbstractControl;

    beforeEach(() => {
      spyOn(component, 'onNameChange').and.stub();
      fixture.detectChanges();
      nameControl = component.formGroup.controls['name'];
    });

    it('should throw required error if value is not entered', (() => {
      expect(nameControl.errors['required']).toBeTruthy();
    }));

    it('should be valid if value is entered', (() => {
      nameControl.setValue('Cerberus');
      expect(nameControl.valid).toBeTruthy();
    }));
  });

  describe('petName control', () => {
    let petNameControl: AbstractControl;

    beforeEach(() => {
      fixture.detectChanges();
      petNameControl = component.formGroup.controls['petName'];
    });

    it('should be valid if a pet name is required and selected', (() => {
      component.matches = createMockVolunteers(); // Pet name is required if there is more than one match
      petNameControl.setValue('Mimi');
      expect(petNameControl.valid).toBeTruthy();
    }));

    it('should return a petNameRequired error if a petName is required and has not been selected', (() => {
      component.matches = createMockVolunteers(); // Pet name is required if there is more than one match
      petNameControl.setValue('');
      expect(petNameControl.errors['petNameRequired']).toBeTruthy();
    }));

    it('should be valid if a pet name is not required', (() => {
      expect(petNameControl.valid).toBeTruthy();
    }));
  });

  describe('signatureField control', () => {
    let signatureControl: AbstractControl;

    beforeEach(() => {
      fixture.detectChanges();
      signatureControl = component.formGroup.controls['signature'];
    });

    it('should be valid if value is entered', (() => {
      signatureControl.setValue(createMockVisits()[0].signature);
      expect(signatureControl.valid).toBeTruthy();
    }));

    it('should be valid (not required) if there is an active visit', (() => {
      component.activeVisit = createMockVisits()[0];
      signatureControl.reset();
      expect(signatureControl.valid).toBeTruthy();
    }));

    it('should return a signatureRequired error if value is not entered', (() => {
      expect(signatureControl.errors['signatureRequired']).toBeTruthy();
    }));
  });
});
