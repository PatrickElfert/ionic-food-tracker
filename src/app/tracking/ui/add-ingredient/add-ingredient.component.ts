import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Chart, DoughnutController, ArcElement } from 'chart.js';
import { ExternalIngredient } from '../../../interfaces/external-ingredient';
import { InputChangeEventDetail, IonInput } from "@ionic/angular";
import {
  BehaviorSubject,
  combineLatest,
  merge,
  Observable,
  of,
  ReplaySubject,
  Subject,
} from 'rxjs';
import { map, take, tap } from 'rxjs/operators';
import { Ingredient } from '../../../interfaces/ingredient';
import { Macros } from '../../../macros';
import { cloneDeep } from "lodash";

@Component({
  selector: 'app-add-ingredient[ingredient][mealCategories]',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIngredientComponent implements OnInit {
  @Input() set ingredient(value: ExternalIngredient) {
    this.$ingredientChangedAction.next(cloneDeep(value));
  }
  @Input() mealCategories!: string[];
  @Output() addIngredient = new EventEmitter<{
    externalIngredient: ExternalIngredient;
    selectedMealCategory: string;
  }>();

  $ingredientChangedAction = new ReplaySubject<ExternalIngredient>();
  $amountChangedAction = new BehaviorSubject<number>(100);

  $ingredient: Observable<ExternalIngredient> = combineLatest([
    this.$ingredientChangedAction,
    this.$amountChangedAction,
  ]).pipe(
    map(([ingredient, amount]) => {
      ingredient.amount = Number(amount);
      return ingredient;
    })
  );

  public selectedMealCategory: string | undefined;

  constructor() {}

  ngOnInit() {}

  onAddIngredient(ingredient: ExternalIngredient) {
    this.addIngredient.emit({
      externalIngredient: ingredient,
      selectedMealCategory: this.selectedMealCategory!,
    });
  }

  onAmountChanged($event: InputChangeEventDetail) {
    if($event.value) {
      this.$amountChangedAction.next(Number($event.value));
    }
  }
}
