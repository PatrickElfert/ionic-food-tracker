import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, retry } from 'rxjs/operators';
import { IngredientDiscoveryService } from './ingredient-discovery.service';
import { Injectable } from '@angular/core';
import { ExternalIngredient } from '../interfaces/external-ingredient';

@Injectable()
export class OpenFoodFactsIngredientDiscoveryService extends IngredientDiscoveryService {
  constructor(private httpClient: HttpClient) {
    super();
  }
  public queryIngredientsByBarcode(
    barcode: string
  ): Observable<ExternalIngredient[]> {
    return this.httpClient
      .get<FoodSearchResult>(
        `https://world.openfoodfacts.org/api/v2/search?code=${barcode}
            &fields=product_name,nutriments,brands`
      )
      .pipe(this.extractExternalIngredients.bind(this), retry(1));
  }
  public queryIngredientsByName(
    name: string
  ): Observable<ExternalIngredient[]> {
    return this.httpClient
      .get<FoodSearchResult>(
        `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${name}
            &search_simple=1&json=1&fields=product_name,nutriments,brands`
      )
      .pipe(this.extractExternalIngredients.bind(this), retry(1));
  }

  public create(): Observable<void> {
    throw new Error('not implemented for open food facts.');
  }
  public update(): Observable<void> {
    throw new Error('not implemented for open food facts.');
  }
  public delete(): Observable<void> {
    throw new Error('Not supported for open food facts');
  }

  private extractExternalIngredients(observable: Observable<FoodSearchResult>) {
    return observable.pipe(
      map((searchResult) =>
        searchResult.products.map((p) => this.toExternalIngredient(p))
      )
    );
  }

  private toExternalIngredient(product: Product): ExternalIngredient {
    return new ExternalIngredient(
      product.product_name,
      product.product_name,
      product.brands,
      {
        carbs: this.formatNutrient(product.nutriments.carbohydrates),
        protein: this.formatNutrient(product.nutriments.proteins),
        fat: this.formatNutrient(product.nutriments.fat),
      },
      100
    );
  }

  private formatNutrient(nutrient: number | undefined) {
    return nutrient ? Math.round(nutrient * 100) / 100 : 0;
  }
}

interface Product {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  product_name: string;
  nutriments: { carbohydrates: number; proteins: number; fat: number };
  brands: string;
}

interface FoodSearchResult {
  products: Product[];
}
