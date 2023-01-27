import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CalorieBarService } from '../calorie-bar.service';
import { BarcodeScannerService } from '../barcode-scanner.service';
import { Ingredient } from '../interfaces/ingredient';
import { IngredientDiscoveryService } from '../ingredient-discovery.service';
import { map, switchMap } from 'rxjs/operators';
import { merge, Subject } from 'rxjs';

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
  ).pipe(
    map((ingredients) =>
      ingredients.map(
        (i) => new selectableIngredient(i.id, i.name, i.macros, i.amount)
      )
    )
  );

  private selectedIngredients: Ingredient[] = [];

  @Output() dismiss = new EventEmitter<Ingredient[]>();

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private ingredientDiscoveryService: IngredientDiscoveryService,
    private calorieBarService: CalorieBarService
  ) {}

  public async onSearchChanged($event: any): Promise<void> {
    this.nameSearchAction.next($event.target.value);
  }

  ngOnInit() {}

  selectionChanged($event: boolean, ingredient: Ingredient) {
    if ($event) {
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

  public onDismiss(): void {
    this.dismiss.emit(this.selectedIngredients);
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
}
