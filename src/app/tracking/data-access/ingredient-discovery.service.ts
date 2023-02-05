import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ExternalIngredient } from '../interfaces/external-ingredient';

@Injectable()
export abstract class IngredientDiscoveryService {
  protected constructor() { }
  public abstract queryIngredientsByName(name: string): Observable<ExternalIngredient[]>;
  public abstract queryIngredientsByBarcode(barcode: string): Observable<ExternalIngredient[]>;

}
