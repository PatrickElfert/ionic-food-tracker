import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  AsyncPipe,
  DecimalPipe,
  NgClass,
  NgIf,
  NgStyle,
  PercentPipe,
} from '@angular/common';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-calorie-bar',
  templateUrl: './calorie-bar.component.html',
  styleUrls: ['./calorie-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonicModule,
    NgStyle,
    AsyncPipe,
    PercentPipe,
    DecimalPipe,
    NgClass,
    NgIf,
  ],
})
export class CalorieBarComponent {
  constructor() {}

  @Output() click = new EventEmitter<string>();
  @Input() calories = 0;
  @Input() calorieLimit = 0;
  @Input() displayAction = true;
}
