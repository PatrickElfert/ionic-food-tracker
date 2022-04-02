import { format } from 'date-fns';
import { TestScheduler } from 'rxjs/testing';
import { tap } from 'rxjs/operators';
import { MealService } from './meal.service';
import { UserService } from './user.service';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { MealPayload } from './interfaces/meal';
import { Firestore } from '@angular/fire/firestore';

describe('MealService', () => {
  let service: MealService;
  let testScheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MealService,
        { provide: UserService, useValue: {} },
        { provide: Firestore, useValue: {} },
      ],
    });
    service = TestBed.inject(MealService);
    testScheduler = new TestScheduler((actual, expected) => {
      expect(actual).toEqual(expected);
    });
  });

  it('it should emit formatted date', () => {
    spyOn(service, 'queryMealsAtDate').and.returnValue(of([] as MealPayload[]));
    testScheduler.run((helpers) => {
      const { expectObservable, cold } = helpers;
      const dates = {
        a: new Date(1, 1, 2019),
        b: new Date(1, 1, 2020),
        c: new Date(1, 1, 2021),
      };

      const formattedDates = {
        a: format(dates.a, 'cccc'),
        b: format(dates.b, 'cccc'),
        c: format(dates.c, 'cccc'),
      };

      cold('a-b-c', dates)
        .pipe(tap((d) => service.selectedDateChangedAction.next(d)))
        .subscribe();

      const expected = 'a-b-c';

      expectObservable(service.selectedDateFormatted$).toBe(
        expected,
        formattedDates
      );
    });
  });

  it('it should emit correct meals at specific date', () => {
    const onDatesChangedSubscriptionsMock = {
      a: new Date(2020, 4, 11),
      b: new Date(2021, 2, 12),
    };

    const exampleFirebaseMeal: MealPayload = {
      name: 'Meal',
      id: '1',
      date: onDatesChangedSubscriptionsMock.a.getTime(),
      ingredients: [],
    };

    const mealsFromFirebase = [
      exampleFirebaseMeal,
      {
        ...exampleFirebaseMeal,
        name: 'Meal2',
        id: '2',
        date: onDatesChangedSubscriptionsMock.b.getTime(),
      },
    ];

    spyOn(service, 'queryMealsAtDate').and.callFake((date) => {
      const filteredMeals = mealsFromFirebase.filter(
        (m) => m.date === date.getTime()
      );
      return of(filteredMeals);
    });

    testScheduler.run((helpers) => {
      const { expectObservable, cold } = helpers;

      cold('a-b', onDatesChangedSubscriptionsMock)
        .pipe(tap((d) => service.selectedDateChangedAction.next(d)))
        .subscribe();

      const expectedMeals = {
        a: [service.toMeal(mealsFromFirebase[0])],
        b: [service.toMeal(mealsFromFirebase[1])],
      };

      expectObservable(service.mealsAtSelectedDate$).toBe('a-b', expectedMeals);
    });
  });
});
