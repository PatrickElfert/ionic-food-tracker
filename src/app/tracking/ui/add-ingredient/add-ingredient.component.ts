import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { Chart, DoughnutController, ArcElement } from 'chart.js';
import { ExternalIngredient } from '../../../interfaces/external-ingredient';

@Component({
  selector: 'app-add-ingredient[ingredient][mealCategories]',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIngredientComponent implements OnInit {
  @Input() ingredient!: ExternalIngredient;
  @Input() mealCategories!: string[];
  @Output() addIngredient = new EventEmitter<{
    externalIngredient: ExternalIngredient;
    selectedMealCategory: string;
  }>();
  public selectedMealCategory: string | undefined;

  chart: any;
  proteinColor = 'rgb(70, 85, 195)';
  fatColor = 'rgb(223, 41, 53)';
  carbsColor = 'rgb(255, 193, 7)';

  constructor() {}

  ngOnInit() {
    Chart.register(DoughnutController, ArcElement);
    const { protein, fat, carbs } = this.ingredient.macros;
    this.chart = new Chart('MyChart', {
      type: 'doughnut',
      data: {
        labels: ['Red', 'Blue', 'Yellow'],
        datasets: [
          {
            data: [protein, fat, carbs],
            backgroundColor: [
              this.proteinColor,
              this.fatColor,
              this.carbsColor,
            ],
            hoverOffset: 4,
          },
        ],
      },
    });
  }

  onAddIngredient() {
    this.addIngredient.emit({
      externalIngredient: this.ingredient,
      selectedMealCategory: this.selectedMealCategory!,
    });
  }
}
