import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ingredient } from '../../../interfaces/ingredient';

@Component({
  selector: 'app-ingredient-item[ingredient]',
  templateUrl: './ingredient-item.component.html',
  styleUrls: ['./ingredient-item.component.scss'],
})
export class IngredientItemComponent implements OnInit {

  @Input() ingredient!: Ingredient;
  @Output() delete = new EventEmitter<Ingredient>();
  @Output() click = new EventEmitter<Ingredient>();

  constructor() { }

  ngOnInit() {}

  public onDelete() {
    this.delete.emit(this.ingredient);
  }

  public onClick() {
    this.click.emit(this.ingredient);
  }
}
