import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Macros } from './macros';

interface Product {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  product_name: string;
  nutriments: { carbohydrates: number; proteins: number; fat: number };
  brands: string;
}

interface FoodSearchResult {
  products: Product[];
}

export class Ingredient {
  public readonly calories: number;
  public selectedAmount: number;

  constructor(
    public name: string,
    public macros: Macros,
    public defaultAmount: number
  ) {
    this.calories =
      ((macros.carbs * 4 + macros.fat * 9 + macros.protein * 4) / 100) *
      defaultAmount;
    this.selectedAmount = defaultAmount;
  }
}

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  constructor(private httpClient: HttpClient) {}

  public async loadIngredients(search: string): Promise<Ingredient[]> {
    const searchResult: FoodSearchResult | undefined = await this.httpClient
      .get<FoodSearchResult>(
        // eslint-disable-next-line max-len
        `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${search}&search_simple=1&json=1&fields=product_name,nutriments,brands`
      )
      .toPromise();
    return searchResult?.products
      .slice(0, 10)
      .map((p) => this.toIngredient(p))
      .filter((i) => i.name);
  }

  public async loadIngredientsByBarcode(
    barcode: string
  ): Promise<Ingredient[]> {
    const searchResult: FoodSearchResult | undefined = await this.httpClient
      .get<FoodSearchResult>(
        `https://world.openfoodfacts.org/api/v2/search?code=${barcode}&fields=product_name,nutriments,brands`
      )
      .toPromise();
    return searchResult.products
      .map((p) => this.toIngredient(p))
      .filter((s) => s.name);
  }

  private formatNutrient(nutrient: number | undefined) {
    return nutrient ? Math.round(nutrient * 100) / 100 : 0;
  }

  private toIngredient(product: Product): Ingredient {
    return new Ingredient(
      product.product_name,
      {
        carbs: this.formatNutrient(product.nutriments.proteins),
        fat: this.formatNutrient(product.nutriments.fat),
        protein: this.formatNutrient(product.nutriments.carbohydrates),
      },
      100
    );
  }
}
