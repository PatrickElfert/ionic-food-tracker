import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-meal-overview',
  templateUrl: './meal-overview.component.html',
  styleUrls: ['./meal-overview.component.sass'],
})
export class MealOverviewComponent implements OnInit {
  today = new Date().toLocaleDateString();

  constructor(private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {}

  navigate() {
      this.router.navigate(['meal'], {relativeTo: this.activatedRoute });
  }
}
