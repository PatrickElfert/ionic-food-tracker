import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';

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

  constructor(public name: string, public macros: Macros, public defaultAmount: number) {
    this.calories = macros.carbs * 4 + macros.fat * 9 + macros.protein * 4;
    this.selectedAmount = defaultAmount;
  }
}

interface Macros {
  protein: number;
  fat: number;
  carbs: number;
}

@Injectable({
  providedIn: 'root'
})
export class IngredientService {

  constructor(private httpClient: HttpClient) {
  }

  public async loadIngredients(search: string): Promise<Ingredient[]> {
    const searchResult: FoodSearchResult | undefined = await this.httpClient
      .get<FoodSearchResult>(
        // eslint-disable-next-line max-len
         `https://world.openfoodfacts.org/cgi/search.pl?action=process&search_terms=${search}&search_simple=1&json=1&fields=product_name,nutriments,brands`
      )
      .toPromise();
    return searchResult?.products
      .slice(0, 10)
      .map(
        (s) =>
          new Ingredient(
            s.product_name,
            {
              carbs: this.formatNutrient(s.nutriments.proteins),
              fat: this.formatNutrient(s.nutriments.fat),
              protein: this.formatNutrient(s.nutriments.carbohydrates),
            },
            100
          )
      ).filter(i => i.name);
  }

  private formatNutrient(nutrient: number | undefined ) {
    return nutrient ? Math.round(nutrient * 100) / 100 : 0;
  }

}
