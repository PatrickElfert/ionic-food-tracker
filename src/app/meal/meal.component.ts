import {
  AfterViewChecked,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ModalController } from '@ionic/angular';
import { IngredientSearchModalComponent } from '../ingredient-search-modal/ingredient-search-modal.component';
import { MealService } from '../meal.service';
import { CalorieBarService } from '../calorie-bar.service';
import { Meal, MealPayload } from '../interfaces/meal';
import { Ingredient } from '../interfaces/ingredient';
import { ActivatedRoute } from '@angular/router';
import { map, mergeMap, switchMap, take, tap } from 'rxjs/operators';
import { doc, docData } from '@angular/fire/firestore';
import {
  from,
  merge,
  Subject,
  Subscription,
} from 'rxjs';

@Component({
  selector: 'app-meal',
  templateUrl: './meal.component.html',
  styleUrls: ['./meal.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MealComponent implements OnInit, AfterViewChecked {
  @ViewChild('input', { static: false }) ionInput:
    | { setFocus: () => void }
    | undefined;
  name = '';

  selectedMeal$ = this.activatedRoute.paramMap.pipe(
    map((p) => p.get('id') as string),
    switchMap((i) =>
      docData<MealPayload>(
        doc(this.mealService.getMealCollectionReference(), i)
      ).pipe(map((m) => this.mealService.toMeal(m)))
    )
  );

  presentModalAction = new Subject();
  presentModalAction$ = this.presentModalAction.asObservable().pipe(
    mergeMap((m) =>
      from(
        this.modalController.create({
          component: IngredientSearchModalComponent,
        })
      )
    ),
    tap((m) => m.present())
  );

  onModalClose$ = this.presentModalAction$
    .pipe(mergeMap((m) => from(m.onWillDismiss())))
    .pipe(
      switchMap((modalEvent) =>
        this.selectedMeal$.pipe(
          take(1),
          map((meal) => ({ meal, modalEvent }))
        )
      ),
      map(({ meal, modalEvent }) => {
        meal.ingredients.push(...(modalEvent.data as Ingredient[]));
        return meal;
      }),
      tap(m => this.calorieBarService.changeCaloriesManualAction.next([]))
    );

  updateIngredientAction = new Subject<{
    ingredient: Ingredient;
    index: number;
  }>();
  onUpdateIngredient$ = this.updateIngredientAction.asObservable().pipe(
    switchMap(({ index, ingredient }) =>
      this.selectedMeal$.pipe(
        take(1),
        map((meal) => ({ index, meal, ingredient }))
      )
    ),
    map(({ index, meal, ingredient }) => {
      meal.ingredients[index] = ingredient;
      return meal;
    })
  );

  deleteIngredientAction = new Subject<number>();
  onDeleteIngredient$ = this.deleteIngredientAction.asObservable().pipe(
    switchMap((index) =>
      this.selectedMeal$.pipe(
        take(1),
        map((meal) => ({ index, meal }))
      )
    ),
    map(({ index, meal }) => {
      meal.ingredients.splice(index, 1);
      return meal;
    })
  );

  mealNameChangeAction = new Subject<string>();
  onMealNameChange$ = this.mealNameChangeAction.asObservable().pipe(
    switchMap((name) =>
      this.selectedMeal$.pipe(
        take(1),
        map((meal) => ({ name, meal }))
      )
    ),
    map(({name, meal}) => new Meal(meal.ingredients, name, meal.id, meal.date))
  );

  onMealChanged$ = merge(
    this.onMealNameChange$,
    this.onDeleteIngredient$,
    this.onUpdateIngredient$,
    this.onModalClose$
  );

  private needsFocus = false;
  private onMealChanged: Subscription | undefined;

  constructor(
    public activatedRoute: ActivatedRoute,
    public modalController: ModalController,
    private calorieBarService: CalorieBarService,
    private changedDetector: ChangeDetectorRef,
    private mealService: MealService
  ) {}

  async ngOnInit(): Promise<void> {}

  public async deleteIngredient(index: number): Promise<void> {
    this.deleteIngredientAction.next(index);
  }

  public async updateIngredient(ingredient: Ingredient, index: number) {
    this.updateIngredientAction.next({ ingredient, index });
  }

  async ionViewDidEnter() {
    this.onMealChanged = this.onMealChanged$.subscribe((m) => {
      this.mealService.setMeal(m);
    });
    this.needsFocus = true;
  }

  async ionViewDidLeave() {
    this.onMealChanged?.unsubscribe();
  }

  ngAfterViewChecked(): void {
    if (this.needsFocus) {
      this.ionInput?.setFocus();
      this.needsFocus = false;
      this.changedDetector.detectChanges();
    }
  }

  public presentModal(): void {
    this.presentModalAction.next();
  }

  public setMeal($event: Event): void {
    this.mealNameChangeAction.next(($event as any).target.value);
  }
}
