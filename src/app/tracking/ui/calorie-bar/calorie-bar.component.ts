import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { CalorieBarService } from '../../data-access/calorie-bar.service';
import {
  AsyncPipe,
  DecimalPipe,
  NgClass, NgIf,
  NgStyle,
  PercentPipe
} from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-calorie-bar',
  templateUrl: './calorie-bar.component.html',
  styleUrls: ['./calorie-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, NgStyle, AsyncPipe, PercentPipe, DecimalPipe, NgClass, NgIf]
})
export class CalorieBarComponent implements OnInit {
  @Output() click = new EventEmitter<string>();
  @Input() displayAction = true;

  constructor(public calorieBarService: CalorieBarService) {}

  ngOnInit(): void {}
}
