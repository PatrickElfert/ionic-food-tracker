import { Component, Input, OnInit } from '@angular/core';
import { ArcElement, Chart, DoughnutController } from 'chart.js';
import { ExternalIngredient } from '../../interfaces/external-ingredient';

@Component({
  selector: 'app-macro-card[ingredient]',
  templateUrl: './macro-card.component.html',
  styleUrls: ['./macro-card.component.scss'],
})
export class MacroCardComponent implements OnInit {

  @Input() ingredient!: ExternalIngredient;
  chart: Chart | undefined;
  proteinColor = 'rgb(70, 85, 195)';
  fatColor = 'rgb(223, 41, 53)';
  carbsColor = 'rgb(255, 193, 7)';
  constructor() { }

  ngOnInit() {
    const {protein, fat, carbs} = this.ingredient.macros;
    Chart.register(DoughnutController, ArcElement),
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
      options: {
        cutout: '70%',
      },
    });
  }

}
