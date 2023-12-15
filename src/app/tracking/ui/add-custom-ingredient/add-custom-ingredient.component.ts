import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { Ingredient } from '../../interfaces/ingredient';
import { MacroCardComponent } from '../macro-card/macro-card.component';

@Component({
  selector: 'app-add-custom-ingredient',
  templateUrl: './add-custom-ingredient.component.html',
  styleUrls: ['./add-custom-ingredient.component.scss'],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    IonicModule,
    MacroCardComponent,
    ReactiveFormsModule,
    FormsModule,
    CommonModule
  ]
})
export class AddCustomIngredientComponent implements OnInit {

  @Input() mealCategories!: string[];
  @Output() addIngredient = new EventEmitter<{
    ingredient: Ingredient;
    selectedMealCategory: string;
  }>();

  constructor() { }

  ngOnInit() {}

}
