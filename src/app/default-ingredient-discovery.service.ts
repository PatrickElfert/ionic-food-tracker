import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Ingredient } from './interfaces/ingredient';
import { flatMap } from 'lodash';
import { IngredientDiscoveryService } from './ingredient-discovery.service';
import { v4 } from 'uuid';
import { Injectable } from '@angular/core';

@Injectable()
export class DefaultIngredientDiscoveryService extends IngredientDiscoveryService {

  public queryIngredientsByBarcode(barcode: string): Observable<Ingredient[]> {
    return from(
      this.httpClient.get<FoodSearchResult>(
        `https://world.openfoodfacts.org/api/v2/search?code=${barcode}&fields=product_name,nutriments,brands`
      )
    ).pipe(
      map((searchResult) =>
        flatMap(searchResult.products, (p) => this.toIngredient(p))
      )
    );
  }

  public queryIngredientsByName(name: string): Observable<Ingredient[]> {
    return from(
      this.httpClient.get<FoodSearchResult>(
        // eslint-disable-next-line max-len
        `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${name}&search_simple=1&json=1&fields=product_name,nutriments,brands`
      )
    ).pipe(
      map((searchResult) =>
        flatMap(searchResult.products, (p) => this.toIngredient(p))
      )
    );
  }

  constructor(private httpClient: HttpClient) {
    super();
  }

  private toIngredient(product: Product): Ingredient {
    return new Ingredient(
      v4(),
      product.product_name,
      product.brands,
      {
        carbs: this.formatNutrient(product.nutriments.carbohydrates),
        fat: this.formatNutrient(product.nutriments.fat),
        protein: this.formatNutrient(product.nutriments.proteins),
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
