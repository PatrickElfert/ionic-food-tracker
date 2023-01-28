import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Ingredient } from "../../../interfaces/ingredient";

@Component({
  selector: 'app-ingredient-search-item[ingredient]',
  templateUrl: './ingredient-search-item.component.html',
  styleUrls: ['./ingredient-search-item.component.scss'],
})
export class IngredientSearchItemComponent implements OnInit {

  @Output() click = new EventEmitter<Ingredient>();
  @Input() ingredient!: Ingredient;
  constructor() { }

  ngOnInit() {}

  public onClick() {
    this.click.emit(this.ingredient);
  }
}
