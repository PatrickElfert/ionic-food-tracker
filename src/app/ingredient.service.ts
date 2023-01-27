import { Injectable } from '@angular/core';
import { Ingredient } from './interfaces/ingredient';
import { CrudService } from './crud.service';
import { FirebaseIngredientService } from './firebase-ingredient.service';

@Injectable({
  providedIn: 'root',
  useClass: FirebaseIngredientService,
})
export abstract class IngredientService extends CrudService<Ingredient> {
  constructor() {
    super();
  }
}
