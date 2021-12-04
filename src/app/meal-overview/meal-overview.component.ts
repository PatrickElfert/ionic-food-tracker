import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MealService} from "../meal.service";

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
})
export class MealOverviewComponent implements OnInit {
  today = new Date().toLocaleDateString();

  constructor(private router: Router, private activatedRoute: ActivatedRoute, private mealService: MealService) { }

  ngOnInit() {}

  navigate() {
      this.router.navigate(['meal'], {relativeTo: this.activatedRoute });
  }
}
