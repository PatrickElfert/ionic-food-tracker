import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ExternalIngredient } from '../../interfaces/external-ingredient';
import {
  combineLatest,
  Observable,
  ReplaySubject,
} from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { MacroCardComponent } from '../macro-card/macro-card.component';

@Component({
  selector: 'app-add-ingredient[ingredient][mealCategories]',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonicModule,
    AsyncPipe,
    MacroCardComponent,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    NgForOf
  ]
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

  private $ingredientChangedAction = new ReplaySubject<ExternalIngredient>();

  public amount = new FormControl(100);
  public $ingredient: Observable<ExternalIngredient> = combineLatest([
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

  public selectedMealCategory: string | undefined;

  constructor() {}

  ngOnInit() {
    this.selectedMealCategory = this.mealCategories[0];
  }

  public onAddIngredient(ingredient: ExternalIngredient): void {
    this.addIngredient.emit({
      externalIngredient: ingredient,
      selectedMealCategory: this.selectedMealCategory!,
    });
  }
}
