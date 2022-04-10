import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CalorieBarService} from '../calorie-bar.service';


@Component({
  selector: 'app-calorie-bar',
  templateUrl: './calorie-bar.component.html',
  styleUrls: ['./calorie-bar.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CalorieBarComponent implements  OnInit{
  @Output() actionClick = new EventEmitter<string>();
  @Input() displayAction = true;

  constructor(public calorieBarService: CalorieBarService) {}

  ngOnInit(): void {}
  }
