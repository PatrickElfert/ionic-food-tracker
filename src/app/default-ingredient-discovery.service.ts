import { HttpClient } from '@angular/common/http';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { flatMap } from 'lodash';
import { IngredientDiscoveryService } from './ingredient-discovery.service';
import { Injectable } from '@angular/core';
import { ExternalIngredient } from './interfaces/external-ingredient';

@Injectable()
export class DefaultIngredientDiscoveryService extends IngredientDiscoveryService {
  public queryIngredientsByBarcode(
    barcode: string
  ): Observable<ExternalIngredient[]> {
    return from(
      this.httpClient.get<FoodSearchResult>(
        `https://world.openfoodfacts.org/api/v2/search?code=${barcode}&fields=product_name,nutriments,brands`
      )
    ).pipe(
      map((searchResult) =>
        flatMap(searchResult.products, (p) => this.toExternalIngredient(p))
      )
    );
  }

  public queryIngredientsByName(
    name: string
  ): Observable<ExternalIngredient[]> {
    return from(
      this.httpClient.get<FoodSearchResult>(
        // eslint-disable-next-line max-len
        `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${name}&search_simple=1&json=1&fields=product_name,nutriments,brands`
      )
    ).pipe(
      map((searchResult) =>
        flatMap(searchResult.products, (p) => this.toExternalIngredient(p))
      )
    );
  }

  constructor(private httpClient: HttpClient) {
    super();
  }

  private toExternalIngredient(product: Product): ExternalIngredient {
    return new ExternalIngredient(
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
