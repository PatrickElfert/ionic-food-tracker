import { Component, OnInit } from '@angular/core';
import { IngredientService } from '../ingredient.service';
import { ModalController } from '@ionic/angular';
import { CalorieBarService } from '../calorie-bar.service';
import { BarcodeScannerService } from '../barcode-scanner.service';
import { Ingredient } from '../interfaces/ingredient';

// eslint-disable-next-line @typescript-eslint/ban-types
type Constructor = new (...args: any[]) => {};

// eslint-disable-next-line @typescript-eslint/naming-convention,prefer-arrow/prefer-arrow-functions
const Select = <T extends Constructor>(base: T) =>
  class Selectable extends base {
    selected = false;
  };

const selectableIngredient = Select(Ingredient);

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search-modal.component.html',
  styleUrls: ['./ingredient-search-modal.component.sass'],
})
export class IngredientSearchModalComponent implements OnInit {
  private ingredientSearchResult: (Ingredient & { selected: boolean })[] = [];
  private selectedIngredients: Ingredient[] = [];

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private calorieBarService: CalorieBarService,
    private ingredientService: IngredientService,
    private modalController: ModalController
  ) {}

  public async onSearchChanged($event: any): Promise<void> {
    this.ingredientSearchResult = (
      await this.ingredientService.loadIngredients(
        $event.target.value as string
      )
    ).map((i) => new selectableIngredient(i.name, i.macros, i.amount));
  }

  ngOnInit() {}

  public async dismissModal(): Promise<void> {
    await this.modalController.dismiss(this.selectedIngredients);
  }

  selectionChanged($event: boolean, ingredient: Ingredient) {
    if ($event) {
      this.selectedIngredients.push(ingredient);
      this.calorieBarService.addCalories(ingredient.calories);
    } else {
      this.selectedIngredients.splice(
        this.selectedIngredients.findIndex((s) => s.name === ingredient.name),
        1
      );
      this.calorieBarService.reduceCalories(ingredient.calories);
    }
  }

  async scanBarcode(): Promise<void> {
    const scannerResult = await this.barcodeScannerService.openBarcodeScanner();
    if (scannerResult) {
      console.log(scannerResult);
      this.ingredientSearchResult = (
        await this.ingredientService.loadIngredientsByBarcode(scannerResult)
      ).map((i) => new selectableIngredient(i.name, i.macros, i.amount));
    }
  }
}
