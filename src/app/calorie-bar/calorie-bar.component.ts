import {Component, Input, OnInit} from '@angular/core';
import {CalorieBarService} from '../calorie-bar.service';

@Component({
  selector: 'app-calorie-bar',
  templateUrl: './calorie-bar.component.html',
  styleUrls: ['./calorie-bar.component.sass']
})
export class CalorieBarComponent {
  constructor(public calorieBarService: CalorieBarService) {
  }

}
