import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from '../interfaces/ingredient';
import { ExternalIngredient } from "../interfaces/external-ingredient";

@Injectable()
export abstract class IngredientDiscoveryService {

  public abstract queryIngredientsByName(name: string): Observable<ExternalIngredient[]>;
  public abstract queryIngredientsByBarcode(barcode: string): Observable<ExternalIngredient[]>;

  constructor() { }
}
