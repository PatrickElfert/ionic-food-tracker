import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { filter, map, switchMap, tap } from "rxjs/operators";
import { merge, Subject } from 'rxjs';
import { BarcodeScannerService } from '../../../barcode-scanner.service';
import { Ingredient } from '../../../interfaces/ingredient';
import { CalorieBarService } from '../../data-access/calorie-bar.service';
import { IngredientDiscoveryService } from '../../../ingredient-discovery.service';

// eslint-disable-next-line @typescript-eslint/ban-types

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search.component.html',
  styleUrls: ['./ingredient-search.component.sass'],
})
export class IngredientSearchComponent implements OnInit {
  private nameSearchAction = new Subject<string>();
  private barcodeSearchAction = new Subject<string>();

  public barcodeSearchResult$ = this.barcodeSearchAction.pipe(
    switchMap((barcode) =>
      this.ingredientDiscoveryService.queryIngredientsByBarcode(barcode)
    )
  );
  public nameSearchResult$ = this.nameSearchAction.pipe(
    switchMap((name) =>
      this.ingredientDiscoveryService.queryIngredientsByName(name)
    )
  );

  public ingredientSearchResult$ = merge(
    this.barcodeSearchResult$,
    this.nameSearchResult$
  ).pipe(map(ingredients => ingredients.filter(ingredient => ingredient.name)));

  private selectedIngredients: Ingredient[] = [];

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private ingredientDiscoveryService: IngredientDiscoveryService,
    private calorieBarService: CalorieBarService
  ) {}

  public async onSearchChanged($event: any): Promise<void> {
    this.nameSearchAction.next($event.target.value);
  }

  ngOnInit() {}

  selectionChanged(selected: boolean, ingredient: Ingredient) {
    if (selected) {
      this.selectedIngredients.push(ingredient);
      this.calorieBarService.changeCaloriesManualAction.next(
        this.selectedIngredients
      );
    } else {
      this.selectedIngredients.splice(
        this.selectedIngredients.findIndex((s) => s.name === ingredient.name),
        1
      );
      this.calorieBarService.changeCaloriesManualAction.next(
        this.selectedIngredients
      );
    }
  }

  public async scanBarcode(): Promise<void> {
    const scannerResult = await this.barcodeScannerService.openBarcodeScanner();
    if (scannerResult) {
      this.barcodeSearchAction.next(scannerResult);
    }
  }

  public recalculateCalories(): void {
    this.calorieBarService.changeCaloriesManualAction.next(
      this.selectedIngredients
    );
  }

  public updateIngredient(ingredient: Ingredient): void {
    const index = this.selectedIngredients.findIndex(
      (s) => s.name === ingredient.name
    );
    if (index !== -1) {
      this.selectedIngredients.splice(index, 1, ingredient);
      this.calorieBarService.changeCaloriesManualAction.next(
        this.selectedIngredients
      );
    }
  }

  onClick(ingredient: Ingredient) {
  }
}
