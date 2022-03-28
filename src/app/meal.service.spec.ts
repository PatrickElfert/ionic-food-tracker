import { Firestore } from '@angular/fire/firestore';
import {format} from 'date-fns';
import {TestScheduler} from 'rxjs/testing';
import {tap} from 'rxjs/operators';
import {MealService} from './meal.service';
import {UserService} from './user.service';

describe('MealService', () => {
  let service: MealService;

  beforeEach(() => {
    service = new MealService({} as Firestore, {} as UserService);
  });

  const testScheduler = new TestScheduler((actual, expected) => {
   expect(actual).toEqual(expected);
  });

  it('should work', () => {
    expect('a').toBe('b');
  });

  it('it should emit formatted date', () => {

    testScheduler.run((helpers) => {
      const {hot, expectObservable} = helpers;
      const dates = { a: new Date(1998, 6, 4), b: new Date(2000, 7, 5) };
      const formattedDates = {a: format(dates.a, 'cccc'), b: format(dates.b, 'cccc')};

      hot('a-b', dates).pipe(tap(d =>
        service.selectedDateChangedAction.next(d)
      )).subscribe();

      expectObservable(service.selectedDateFormatted$).toBe('a-b',formattedDates);
    });

  });
});
