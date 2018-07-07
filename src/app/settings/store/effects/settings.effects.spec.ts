import { async, TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable, of } from 'rxjs';
import * as SessionActions from '../../../auth/store/actions/session.actions';
import { createMockOrganizations } from '../../../mock/objects/organization.mock';
import { createMockUsers } from '../../../mock/objects/user.mock';
import { createMockVisits } from '../../../mock/objects/visit.mock';
import { mockServiceProviders } from '../../../mock/providers.mock';
import { mockStoreModules } from '../../../mock/store-modules.mock';
import { Organization } from '../../../models';
import { SnackBarService } from '../../../shared/services/snack-bar.service';
import { CsvService } from '../../services/csv.service';
import * as SettingsActions from '../actions/settings.actions';
import { SettingsEffects } from './settings.effects';

describe('SettingsEffects', () => {
  let effects: SettingsEffects;
  let actions: Observable<any>;

  beforeEach(async(() => {
    actions = of('');
    TestBed.configureTestingModule({
      providers: [
        SettingsEffects,
        provideMockActions(() => actions),
        ...mockServiceProviders,
      ],
      imports: [
        ...mockStoreModules,
      ],
    })
    ;
    effects = TestBed.get(SettingsEffects);
  }));

  describe('updateOrganization$', () => {
    let organization: Organization;

    beforeEach(async(() => {
      organization = createMockOrganizations()[1];
      actions = hot('a', {
        a: new SettingsActions.UpdateOrganization(organization),
      });
    }));

    it('should dispatch SessionActions.UpdateOrganization', () => {
      const expected = cold('b', {
        b: new SessionActions.UpdateOrganization(organization),
      });
      expect(effects.updateOrganization$).toBeObservable(expected);
    });

    it('should open the updateOrganizationSuccess snackbar', () => {
      const updateOrganizationSuccessSpy = spyOn(TestBed.get(SnackBarService), 'updateOrganizationSuccess');
      effects.updateOrganization$.subscribe(() => {
        expect(updateOrganizationSuccessSpy).toHaveBeenCalled();
      });
    });
  });

  describe('updateUser$', () => {

    beforeEach(async(() => {
      actions = hot('a', {
        a: new SettingsActions.UpdateUser({ ...createMockUsers()[1], role: undefined }),
      });
    }));

    it(
      'should dispatch SessionActions.UpdateUser with the edited user and without changes to the role property',
      (() => {
        const expected = cold('b', {
          b: new SessionActions.UpdateUser({ ...createMockUsers()[1], role: createMockUsers()[0].role }),
        });
        expect(effects.updateUser$).toBeObservable(expected);
      }),
    );

    it('should open the updateUserSuccess snackbar', () => {
      const updateUserSuccessSpy = spyOn(TestBed.get(SnackBarService), 'updateUserSuccess');
      effects.updateUser$.subscribe(() => {
        expect(updateUserSuccessSpy).toHaveBeenCalled();
      });
    });
  });

  describe('generateVisitHistoryReport$', () => {
    beforeEach(async(() => {
      actions = hot('a', {
        a: new SettingsActions.GenerateVisitHistoryReport({
          startedAt: new Date(),
          endedAt: new Date(),
        }),
      });
    }));

    it('should emit download csv, on success', (() => {
      const downloadCsvSpy = spyOn(TestBed.get(CsvService), 'downloadAsCsv');
      effects.generateVisitHistoryReport$.subscribe(() => {
        expect(downloadCsvSpy).toHaveBeenCalled();
      });
    }));
  });

  describe('updateVisits$', () => {
    beforeEach(async(() => {
      actions = hot('a', {
        a: new SettingsActions.UpdateVisits(createMockVisits()),
      });
    }));

    it('should open the updateVisitsSuccess snackbar', (() => {
      const updateVisitsSuccessSpy = spyOn(TestBed.get(SnackBarService), 'updateVisitsSuccess');
      effects.updateVisits$.subscribe(() => {
        expect(updateVisitsSuccessSpy).toHaveBeenCalled();
      });
    }));
  });
});