import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  tick,
  waitForAsync,
} from '@angular/core/testing';
import { MealOverviewComponent } from './meal-overview.component';
import { MealService } from '../meal.service';
import { ActionSheetController, IonicModule } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { asapScheduler, of, scheduled } from 'rxjs';
import { addDays, format } from 'date-fns';
import { Meal } from '../interfaces/meal';
import { Ingredient } from '../interfaces/ingredient';
import { MealCardComponent } from '../meal-card/meal-card.component';
import { CalorieBarComponent } from '../calorie-bar/calorie-bar.component';

describe('MealOverview', () => {
  let component: MealOverviewComponent;
  let fixture: ComponentFixture<MealOverviewComponent>;

  const today = new Date();

  const meal = new Meal(
    [
      new Ingredient('Brot', { protein: 2, carbs: 3, fat: 4 }, 100),
      new Ingredient('Toast', { protein: 1, carbs: 2, fat: 5 }, 100),
    ],
    'ToastBrot',
    '123',
    today
  );

  const mealServiceStub ={
    selectedDateFormatted$: scheduled(
      of(format(new Date(), 'cccc')),
      asapScheduler
    ),
    mealsAtSelectedDate$: scheduled(of([meal]), asapScheduler),
    setSelectedDate: (date: Date) => undefined,
    createEmptyMeal: (date: Date) => '',
  };

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [
          MealOverviewComponent,
          MealCardComponent,
          CalorieBarComponent,
        ],
        imports: [RouterTestingModule, IonicModule],
        providers: [
          { provide: MealService, useValue: mealServiceStub },
          ActionSheetController,
        ],
      }).compileComponents();
      fixture = TestBed.createComponent(MealOverviewComponent);
      component = fixture.componentInstance;
      // @ts-ignore
      component.currentDate = today;
    })
  );

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display meal cards correctly', fakeAsync(() => {
    fixture.detectChanges();
    tick();
    fixture.detectChanges();
    const mealCards = fixture.nativeElement.querySelectorAll('#mealCard');
    const name = mealCards[0].querySelector('#mealName');
    const calories = mealCards[0].querySelector('#calories');
    const protein = mealCards[0].querySelector('#protein');
    const fats = mealCards[0].querySelector('#fats');
    const carbs = mealCards[0].querySelector('#carbs');

    expect(mealCards.length).toEqual(1);
    expect(calories.textContent).toEqual('113 kcal');
    expect(carbs.textContent).toEqual('5 g');
    expect(fats.textContent).toEqual('9 g');
    expect(protein.textContent).toEqual('3 g');
    expect(name.textContent).toEqual('ToastBrot');
  }));

  it('should change date', () => {
    const setSelectedDateSpy = spyOn(mealServiceStub, 'setSelectedDate');
    fixture.componentInstance.nextDay();
    expect(setSelectedDateSpy.calls.count()).toEqual(1);
    expect(setSelectedDateSpy.calls.first().args[0].toString()).toEqual(
      addDays(today, 1).toString()
    );
    fixture.componentInstance.previousDay();
    expect(setSelectedDateSpy.calls.count()).toEqual(2);
    expect(setSelectedDateSpy.calls.mostRecent().args[0].toString()).toEqual(
      today.toString()
    );
  });

  it('calls set meal with correct data', () => {
    const createEmptyMealSpy = spyOn(mealServiceStub, 'createEmptyMeal');
    fixture.componentInstance.onCreateNewMeal();
    expect(createEmptyMealSpy.calls.count()).toEqual(1);
    const args = createEmptyMealSpy.calls.first().args[0];
    expect(args.getTime()).toBe(today.getTime());
  });
});
