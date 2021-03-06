import { async, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { cold, hot } from 'jasmine-marbles';
import { Observable } from 'rxjs';
import { mockVisits } from '../../../mocks/objects/visit.mock';
import { mockVolunteers } from '../../../mocks/objects/volunteer.mock';
import { mockProviders } from '../../../mocks/providers.mock';
import { mockStoreModules } from '../../../mocks/store.mock';
import { Back } from '../../core/actions/router.actions';
import { SnackBarService } from '../../core/services/snack-bar.service';
import { CheckIn, CheckOut, SubmitNewVolunteer } from '../actions/check-in.actions';
import { CheckInEffects } from './check-in.effects';

xdescribe('CheckInEffects', () => {
  let effects: CheckInEffects;
  let actions: Observable<any>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        CheckInEffects,
        provideMockActions(() => actions),
        ...mockProviders,
      ],
      imports: [
        RouterTestingModule,
        ...mockStoreModules,
      ],
    });
    effects = TestBed.get(CheckInEffects);
  }));

  describe('submitNewVolunteer$', () => {
    beforeEach(() => {
      actions = hot('a', {
        a: new SubmitNewVolunteer({ volunteer: mockVolunteers[0] }),
      });
    });

    it('should open the createVolunteerSuccess snackbar', async(() => {
      const signUpSuccessSpy = spyOn(TestBed.get(SnackBarService), 'createVolunteerSuccess');
      effects.submitNewVolunteer$.subscribe(() => {
        expect(signUpSuccessSpy).toHaveBeenCalled();
      });
    }));
  });

  describe('checkIn$', () => {
    beforeEach(() => {
      actions = hot('a', {
        a: new CheckIn({ visit: mockVisits[0] }),
      });
    });

    it('should dispatch Back', async(() => {
      const expected = cold('b', {
        b: new Back(),
      });
      expect(effects.checkIn$).toBeObservable(expected);
    }));

    it('should open the checkInSuccess snackbar', async(() => {
      const checkInSuccessSpy = spyOn(TestBed.get(SnackBarService), 'checkInSuccess');
      effects.checkIn$.subscribe(() => {
        expect(checkInSuccessSpy).toHaveBeenCalled();
      });
    }));
  });

  describe('checkOut$', () => {
    beforeEach(() => {
      actions = hot('a', {
        a: new CheckOut({ visit: mockVisits[0] }),
      });
    });

    it('should dispatch Back', async(() => {
      const expected = cold('b', {
        b: new Back(),
      });
      expect(effects.checkOut$).toBeObservable(expected);
    }));

    it('should open the checkOutSuccess snackbar', async(() => {
      const checkOutSuccessSpy = spyOn(TestBed.get(SnackBarService), 'checkOutSuccess');
      effects.checkOut$.subscribe(() => {
        expect(checkOutSuccessSpy).toHaveBeenCalled();
      });
    }));
  });
});
