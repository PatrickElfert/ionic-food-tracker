import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
} from '@angular/core';
import { ExternalIngredient } from '../../interfaces/external-ingredient';
import { IonicModule } from '@ionic/angular';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-ingredient-search-item[ingredient]',
  templateUrl: './ingredient-search-item.component.html',
  styleUrls: ['./ingredient-search-item.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [IonicModule, DecimalPipe],
})
export class IngredientSearchItemComponent implements OnInit {
  @Output() click = new EventEmitter<ExternalIngredient>();
  @Input() ingredient!: ExternalIngredient;
  constructor() {}
  ngOnInit() {}
  public onClick() {
    this.click.emit(this.ingredient);
  }
}
