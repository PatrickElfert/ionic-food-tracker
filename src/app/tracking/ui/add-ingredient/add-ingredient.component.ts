import {
  AfterViewInit, ChangeDetectionStrategy,
  Component,
  Input,
  OnInit
} from "@angular/core";
import { Ingredient } from '../../../interfaces/ingredient';
import { Chart, DoughnutController, ArcElement } from 'chart.js';
import { MealService } from "../../../meal.service";
import { Meal } from "../../../interfaces/meal";

@Component({
  selector: 'app-add-ingredient[ingredient]',
  templateUrl: './add-ingredient.component.html',
  styleUrls: ['./add-ingredient.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddIngredientComponent implements OnInit {
  @Input() ingredient!: Ingredient;

  chart: any;
  proteinColor = 'rgb(70, 85, 195)';
  fatColor = 'rgb(223, 41, 53)';
  carbsColor = 'rgb(255, 193, 7)';

  constructor(private mealService: MealService) {}

  ngOnInit() {
    Chart.register(DoughnutController, ArcElement);
    const { protein, fat, carbs } = this.ingredient.macros;
    this.chart = new Chart('MyChart', {
      type: 'doughnut',
      data: {
        labels: [
          'Red',
          'Blue',
          'Yellow'
        ],
        datasets: [{
          data: [protein, fat, carbs],
          backgroundColor: [
            this.proteinColor,
            this.fatColor,
            this.carbsColor
          ],
          hoverOffset: 4
        }]
      },
    });
  }

  onAddIngredient() {
  }
}
