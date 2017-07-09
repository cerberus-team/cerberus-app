import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { VolunteerService } from '../../shared/volunteer.service';
import { VisitService } from '../../shared/visit.service';
import { Volunteer } from 'app/shared/volunteer';

@Component({
  selector: 'app-check-in-form',
  templateUrl: './check-in-form.component.html',
  styleUrls: ['./check-in-form.component.css'],
})
export class CheckInFormComponent implements OnInit {
  public error: string;
  public names: string[];
  public formGroup: FormGroup;
  public selectedVolunteer: Volunteer;
  public volunteers: Volunteer[];
  public filteredVolunteers: Volunteer[];
  public showPetNameForm: boolean;

  constructor(private fb: FormBuilder, private visitService: VisitService, private volunteerService: VolunteerService) {
    this.createForm();
    this.subscribeToForm();
  }

  ngOnInit(): void {
    this.names = [];
    this.getVolunteers();
  }

  createForm(): void {
    const volunteerExistenceValidator = (control: AbstractControl): { [key: string]: any } => {
      const name = control.value;
      const match = this.volunteers ? this.volunteers.find(volunteer => this.formatName(volunteer) === name) : null;
      if (!this.showPetNameForm) {
        this.selectedVolunteer = match;
      }
      return match ? null : { 'doesNotExist': { name } };
    };
    const volunteerUniqueValidator = (control: AbstractControl): { [key: string]: any } => {
      const petName = control.value;
      const filtered = this.filterVolunteersByPetName(control.value);
      const match = filtered && filtered.length === 1 ? filtered[0] : null;
      this.selectedVolunteer = match;
      return match ? null : { 'notUnique': { name } };
    };
    this.formGroup = this.fb.group({
      name: ['', [Validators.required, volunteerExistenceValidator]],
      petName: ['', volunteerUniqueValidator]
    });
  }

  subscribeToForm(): void {
    this.formGroup.valueChanges
      .subscribe(changes => {
        this.filterVolunteers(changes.name);
        this.showPetNameForm = this.checkIfNamesMatch(changes.name);
        console.log(this.selectedVolunteer);
      });
  }

  filterVolunteers(name: string): void {
    this.filteredVolunteers = name
      ? this.volunteers.filter(
        volunteer => `${volunteer.firstName.toLowerCase()} ${volunteer.lastName.toLowerCase()}`.includes(name.toLowerCase()))
      : null;
  }

  /**
   * Checks if the given pet name narrows the filtered volunteers to one.
   * @param name
   * @returns {boolean}
   */
  filterVolunteersByPetName(petName: string): Volunteer[] {
    return this.filteredVolunteers ? this.filteredVolunteers.filter(volunteer => volunteer.petName === petName) : null;
  }

  /**
   * Checks if the filtered volunteers contain more than one volunteer of the same name.
   * @param name
   * @returns {boolean}
   */
  checkIfNamesMatch(name: string): boolean {
    return this.filteredVolunteers && this.filteredVolunteers.length > 1
      ? this.filteredVolunteers.filter(
        volunteer => this.formatName(volunteer).toLowerCase() === name.toLowerCase()).length === this.filteredVolunteers.length
      : false;
  }

  formatName(volunteer: Volunteer) {
    return `${volunteer.firstName} ${volunteer.lastName}`;
  }

  onSubmit(): void {
    console.log(this.formGroup.value);
    // this.visitService.postVisit(this.nameControl.value)
    //   .subscribe(
    //     res => console.log(res),
    //     error => this.error = <any>error);
    // this.nameControl.reset();
  }

  getVolunteers(): void {
    this.volunteerService.getVolunteers()
      .subscribe(volunteers => this.volunteers = volunteers,
        error => this.error = <any>error);
  }
}
