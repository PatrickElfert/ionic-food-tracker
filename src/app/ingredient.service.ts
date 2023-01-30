import { Injectable } from '@angular/core';
import { Ingredient, IngredientPayload } from "./interfaces/ingredient";
import { FirebaseIngredientService } from './firebase-ingredient.service';
import { Observable } from "rxjs";

@Injectable()
export abstract class IngredientService {
  constructor() {}

  public abstract queryIngredientsAtDate(date: Date): Observable<Ingredient[]>;
  public abstract delete(id: string): Observable<void>;
  public abstract update(ingredient: Partial<Ingredient> & { id: string }): Observable<void>;

  public abstract create(ingredient: Ingredient): Observable<void>;
}
