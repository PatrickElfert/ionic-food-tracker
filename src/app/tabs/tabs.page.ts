import {Component } from '@angular/core';
import {CalorieBarService} from '../calorie-bar.service';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.sass']
})
export class TabsPage {
  constructor(private calorieBarService: CalorieBarService) {}

}
