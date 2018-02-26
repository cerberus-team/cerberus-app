import { animate, state as animationsState, style, transition, trigger } from '@angular/animations';
import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  FormGroupDirective,
  Validators,
} from '@angular/forms';
import { MatAutocomplete } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';
import { getFullName } from '../../functions';

import { Visit, Volunteer } from '../../models';
import { SignatureFieldComponent } from '../signature-field/signature-field.component';

@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.scss'],
  animations: [
    trigger('fadeInTrigger', [
      animationsState('fadeIn', style({
        opacity: '1',
      })),
      transition('void => *', [
        style({ opacity: '0' }),
        animate('500ms 0s ease-in'),
      ]),
    ]),
  ],
})
export class CheckInFormComponent implements OnInit, OnDestroy {
  @Input() organizationId: string;
  @Input() siteId: string;
  @Input() visits: Visit[];
  @Input() volunteers: Volunteer[];
  @Output() checkIn = new EventEmitter<Visit>();
  @Output() checkOut = new EventEmitter<Visit>();

  @ViewChild(FormGroupDirective) ngForm: FormGroupDirective;
  @ViewChild(MatAutocomplete) autocomplete: MatAutocomplete;
  @ViewChildren(SignatureFieldComponent) signatures: QueryList<SignatureFieldComponent>;

  formGroupSubscription: Subscription;
  formGroup: FormGroup;

  filteredVolunteers: Volunteer[];
  autocompleteNames: string[];
  showPetNameForm: boolean;
  activeVisit: Visit;
  selectedVolunteer: Volunteer;
  selectedPetName: string;

  fadeInState: string;

  /**
   * Creates the form group and subscribes on construction.
   */
  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.activeVisit = null;
    this.selectedVolunteer = null;

    this.formGroup = this.createForm();
    this.formGroupSubscription = this.subscribeToForm();
  }

  ngOnDestroy(): void {
    if (this.formGroupSubscription) {
      this.formGroupSubscription.unsubscribe();
    }
  }

  ngAfterView(): void {
    this.setSignatureOptions();
  }

  /**
   * Constructs the visit with startedAt as no, and endedAt as null,
   * emits the onCheckIn or onCheckOut events, then resets the form.
   */
  submit(): void {
    if (!this.selectedVolunteer) {
      return;
    }
    if (this.activeVisit) {
      const visit = Object.assign({}, this.activeVisit, { endedAt: new Date() });
      this.checkOut.emit(visit);
    } else {
      const visit = new Visit(
        this.organizationId,
        this.siteId,
        this.selectedVolunteer.id,
        new Date(),
        null,
        'America/Chicago',
        this.signatures.first ? this.signatures.first.signature : null,
      );
      this.checkIn.emit(visit);
    }
    this.ngForm.resetForm();
  }

  // Form update flow

  /**
   * Resets the form state.
   */
  resetForm(): void {
    this.selectedVolunteer = null;
    this.selectedPetName = null;
    this.clearSignature();
  }

  /**
   * Updates filtered lists and selected data.
   * Called in nameValidator because validator executes before formGroup value changes.
   * @param name - string used to filter volunteers by name
   */
  updateForm(name: string): void {
    this.resetForm();
    // Create the list of filtered volunteers by name
    this.filteredVolunteers = this.filterVolunteersByName(this.volunteers, name);
    // If multiple volunteers all match the name, set to true
    this.showPetNameForm = this.filteredVolunteers.length > 1
      && this.allMatchName(this.filteredVolunteers, name);
    // If one newVolunteer remains, select the newVolunteer that exactly matches the name
    if (!this.showPetNameForm) {
      this.selectedVolunteer = this.selectVolunteerByName(this.filteredVolunteers, name);
    }
  }

  /**
   * Subscribes to the form group and attempts to select an active visit
   * if a newVolunteer is selected.
   */
  subscribeToForm(): Subscription {
    return this.formGroup.valueChanges
      .subscribe(() => {
        // Uses values set in filterAndSelect invoked by nameValidator
        this.autocompleteNames = this.getUniqueNames(this.filteredVolunteers);
        this.activeVisit = this.selectedVolunteer
          ? this.selectActiveVisit(this.visits, this.selectedVolunteer)
          : null;
      });
  }

  /**
   * Updates state when a pet name is selected.
   * @param petName - the selected petName
   */
  onPetNameChange(petName: string): void {
    this.selectedVolunteer = this.selectVolunteerByPetName(this.filteredVolunteers, petName);
  }

  // FormGroup and validators

  /**
   * Validates if a matching newVolunteer is found by name (control.value).
   * @param control
   */
  nameValidator = (control: AbstractControl): { [key: string]: any } => {
    // Update state in validator since formControl.valueChanges calls next() after validation
    // TODO: Find out how to update form outside validator
    if (control.value) {
      this.updateForm(control.value);
    }
    return this.selectedVolunteer
    || this.showPetNameForm
      ? null
      : { noMatchByName: { value: control.value } };
  }

  /**
   * Validates if a matching newVolunteer is found by pet name (control.value) if needed.
   * @param control
   */
  petNameValidator = (control: AbstractControl): { [key: string]: any } => {
    return !this.showPetNameForm
    || this.selectedVolunteer
      ? null
      : { noMatchByPetName: { value: control.value } };
  }

  /**
   * Validates if a signature (control.value) has been entered if needed.
   * @param control
   */
  signatureValidator = (control: AbstractControl): { [key: string]: any } => {
    return this.activeVisit
    || control.value
      ? null
      : { noSignature: { value: control.value } };
  }

  /**
   * Creates the form group.
   * @returns {FormGroup}
   */
  createForm(): FormGroup {
    return this.fb.group({
      name: ['', [Validators.required, this.nameValidator]],
      petName: ['', this.petNameValidator],
      signatureField: ['', this.signatureValidator],
    });
  }

  // Filtering and selection

  /**
   * Filters the volunteers by name (case-insensitive).
   * @param volunteers - the list of volunteers to be filtered
   * @param name - the name to filter by
   * @returns {Volunteer[]} - the filtered list of volunteers
   */
  filterVolunteersByName(volunteers: Volunteer[], name: string): Volunteer[] {
    const nameLowerCase = name.toLowerCase();
    return volunteers
      .filter(volunteer => this.formatName(volunteer).toLowerCase().includes(nameLowerCase));
  }

  /**
   * Creates the list of unique newVolunteer names to be displayed on the autocomplete menu.
   * @param volunteers - the list of volunteers
   * @returns {Array<T>} - the list of unique names
   */
  getUniqueNames(volunteers: Volunteer[]): string[] {
    return Array.from(
      new Set(volunteers.map(volunteer => this.formatName(volunteer))),
    );
  }

  /**
   * Checks if all volunteers match the name (case-insensitive).
   * @param volunteers - the list of volunteers
   * @param name - the name used to match
   * @returns {boolean} - true if all volunteers match the name
   */
  allMatchName(volunteers: Volunteer[], name: string): boolean {
    const nameLowerCase = name.toLowerCase();
    return volunteers.every(volunteer => (
      this.formatName(volunteer).toLowerCase() === nameLowerCase
    ));
  }

  /**
   * Selects a newVolunteer by name (case-insensitive).
   * @param volunteers - the list of volunteers
   * @param name - string used to search by name
   * @returns {undefined|Volunteer} - the newVolunteer or undefined if not found
   */
  selectVolunteerByName(volunteers: Volunteer[], name: string): Volunteer {
    const nameLowerCase = name.toLowerCase();
    return volunteers.find(volunteer => this.formatName(volunteer).toLowerCase() === nameLowerCase);
  }

  /**
   * Selects a newVolunteer by petName (case-insensitive).
   * @param volunteers - the list of volunteers
   * @param petName - string used to search by petName
   * @returns {undefined|Volunteer} - the newVolunteer or undefined if not found
   */
  selectVolunteerByPetName(volunteers: Volunteer[], petName: string): Volunteer {
    const petNameLowerCase = petName.toLowerCase();
    return volunteers.find(volunteer => volunteer.petName.toLowerCase() === petNameLowerCase);
  }

  /**
   * Selects an active visit for the given newVolunteer.
   * @param visits - the list of visits
   * @param volunteer - the newVolunteer search by
   * @returns {undefined|Visit} - the active visit or undefined if not found
   */
  selectActiveVisit(visits: Visit[], volunteer: Volunteer): Visit {
    return visits.find(visit => visit.endedAt === null && volunteer.id === visit.volunteerId);
  }

  // Signature Field

  /**
   * Set signature pad properites.
   */
  setSignatureOptions(): void {
    this.signatures.first.signaturePad.set('penColor', 'rgb(0, 0, 0)');
    this.signatures.first.signaturePad.set('backgroundColor', 'rgb(255, 255, 255, 0)');
    this.signatures.first.signaturePad.clear(); // clear() is needed to set the background color
  }

  /**
   * Clears the signature.
   */
  clearSignature(): void {
    if (this.signatures.first) {
      this.signatures.first.clear();
    }
  }

  /**
   * Assigns signature to existing signature passed in.
   * The signature will be displayed in the signature pad once set.
   * @param signature
   */
  setSignature(signature): void {
    this.signatures.first.signature.setSignatureToExistingSignature(signature);
  }

  /**
   * Formats the name of a newVolunteer as one string.
   * @param volunteer - the newVolunteer to use
   * @returns {string} - the full name as a string
   */
  private formatName(volunteer: Volunteer): string {
    return getFullName(volunteer);
  }
}
