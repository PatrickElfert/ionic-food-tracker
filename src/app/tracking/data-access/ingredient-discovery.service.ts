import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExternalIngredient } from '../interfaces/external-ingredient';

@Injectable()
export abstract class IngredientDiscoveryService {
  protected constructor() {}
  public abstract queryIngredientsByName(
    name: string
  ): Observable<ExternalIngredient[]>;
  public abstract queryIngredientsByBarcode(
    barcode: string
  ): Observable<ExternalIngredient[]>;

  public abstract create(ingredient: ExternalIngredient): Observable<void>;
  public abstract update(ingredient: Partial<ExternalIngredient & {id: string}>): Observable<void>;
  public abstract delete(id: string): Observable<void>;
}
