import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ExternalIngredient } from '../../../interfaces/external-ingredient';
import {
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { FormControl } from '@angular/forms';

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

  amount = new FormControl(100);

  $ingredient: Observable<ExternalIngredient> = combineLatest([
    this.$ingredientChangedAction,
    this.amount.valueChanges.pipe(startWith(100)),
  ]).pipe(
    map(([ingredient, amount]) => {
      if (amount) {
        ingredient.amount = amount;
      }
      return ingredient;
    })
  );

  selectedMealCategory: string | undefined;

  constructor() {}

  ngOnInit() {
    this.selectedMealCategory = this.mealCategories[0];
  }

  onAddIngredient(ingredient: ExternalIngredient) {
    this.addIngredient.emit({
      externalIngredient: ingredient,
      selectedMealCategory: this.selectedMealCategory!,
    });
  }
}
