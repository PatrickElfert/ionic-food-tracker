import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from './interfaces/ingredient';

@Injectable()
export abstract class IngredientDiscoveryService {

  public abstract queryIngredientsByName(name: string): Observable<Ingredient[]>;
  public abstract queryIngredientsByBarcode(barcode: string): Observable<Ingredient[]>;

  constructor() { }
}
