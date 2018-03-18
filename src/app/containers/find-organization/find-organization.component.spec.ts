import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatAutocompleteModule, MatInputModule, MatTabsModule } from '@angular/material';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';
import { reducers } from '../../reducers';

import { FindOrganizationComponent } from './find-organization.component';

describe('FindOrganizationComponent', () => {
  let component: FindOrganizationComponent;
  let fixture: ComponentFixture<FindOrganizationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FindOrganizationComponent],
      imports: [
        MatAutocompleteModule,
        MatInputModule,
        StoreModule.forRoot(reducers),
        BrowserAnimationsModule,
      ],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FindOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
