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
import { IonInput } from '@ionic/angular';
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

@Component({
  selector: 'app-add-ingredient[ingredient][mealCategories]',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIngredientComponent implements OnInit {
  @Input() set ingredient(value: ExternalIngredient) {
    this.$ingredientChangedAction.next(value);
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

  $chart = this.$ingredient.pipe(
    take(1),
    tap(() => Chart.register(DoughnutController, ArcElement)),
    map(({ macros }) => this.getChart(macros))
  );

  $vm: Observable<{ makeChart: () => Chart; ingredient: ExternalIngredient }> =
    combineLatest([this.$ingredient, this.$chart]).pipe(
      map(([ingredient, chart]) => ({ ingredient, makeChart: chart })),
      tap(({ ingredient }) => console.log(ingredient))
    );

  public selectedMealCategory: string | undefined;

  proteinColor = 'rgb(70, 85, 195)';
  fatColor = 'rgb(223, 41, 53)';
  carbsColor = 'rgb(255, 193, 7)';

  constructor() {}

  ngOnInit() {}

  private getChart(macros: Macros) {
    return () =>
      new Chart('MyChart', {
        type: 'doughnut',
        data: {
          labels: ['Red', 'Blue', 'Yellow'],
          datasets: [
            {
              data: [macros.protein, macros.fat, macros.carbs],
              backgroundColor: [
                this.proteinColor,
                this.fatColor,
                this.carbsColor,
              ],
              hoverOffset: 4,
            },
          ],
        },
        options: {
          cutout: '70%',
        },
      });
  }

  onAddIngredient(ingredient: ExternalIngredient) {
    this.addIngredient.emit({
      externalIngredient: ingredient,
      selectedMealCategory: this.selectedMealCategory!,
    });
  }
}
