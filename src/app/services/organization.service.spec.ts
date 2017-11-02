import { async, getTestBed, inject, TestBed } from '@angular/core/testing';
import { AngularFirestore } from 'angularfire2/firestore';

import { OrganizationService } from './organization.service';
import { ErrorService, MockErrorService } from './error.service';
import { Organization, testOrganizations } from '../models/organization';

describe('OrganizationService', () => {
  let service: OrganizationService;
  let organization: Organization;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganizationService,
        { provide: AngularFirestore, useValue: null },
        { provide: ErrorService, useClass: MockErrorService }
      ]
    });
    const testbed = getTestBed();
    service = testbed.get(OrganizationService);
    organization = Object.assign({}, testOrganizations[0]);
    organization.name = 'jefferson sPCA';
    organization.description = 'the Jefferson SPCA exists to support the Jefferson Parish Animal Shelter.';
  }));

  it('is created', inject([OrganizationService], (organizationService: OrganizationService) => {
    expect(organizationService).toBeTruthy();
  }));

  it('converts coming from the database', () => {
    const converted = service.convertIn(organization);
    expect(converted).toEqual(testOrganizations[0]);
  });

  it('converts data going to the database', () => {
    const converted = service.convertOut(organization);
    expect(converted).toEqual(testOrganizations[0]);
  });
});