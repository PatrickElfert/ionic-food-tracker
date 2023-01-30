import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  OnInit,
  Output,
} from '@angular/core';
import {
  filter,
  finalize,
  map,
  scan,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs/operators';
import { BehaviorSubject, from, merge, of, Subject } from 'rxjs';
import { BarcodeScannerService } from '../../../barcode-scanner.service';
import { Ingredient } from '../../../interfaces/ingredient';
import { CalorieBarService } from '../../data-access/calorie-bar.service';
import { IngredientDiscoveryService } from '../../../ingredient-discovery.service';
import { Platform } from '@ionic/angular';
import { DiaryService } from "../../data-access/diary.service";

// eslint-disable-next-line @typescript-eslint/ban-types

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search.component.html',
  styleUrls: ['./ingredient-search.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientSearchComponent implements OnInit {
  private nameSearchAction = new Subject<string>();
  private barcodeSearchAction = new Subject<string>();
  private ingredientSelectedAction = new BehaviorSubject<
    Ingredient | undefined
  >(undefined);

  public selectedIngredient$ = this.ingredientSelectedAction.asObservable();

  public loading = false;
  public modalHeight$ = of(this.platform.height()).pipe(
    map((height) => 450 / height)
  );

  public barcodeSearchResult$ = this.barcodeSearchAction.pipe(
    tap(() => (this.loading = true)),
    switchMap((barcode) =>
      this.ingredientDiscoveryService.queryIngredientsByBarcode(barcode)
    )
  );
  public nameSearchResult$ = this.nameSearchAction.pipe(
    tap(() => (this.loading = true)),
    switchMap((name) =>
      this.ingredientDiscoveryService.queryIngredientsByName(name)
    )
  );

  public ingredientSearchResult$ = merge(
    this.barcodeSearchResult$,
    this.nameSearchResult$
  ).pipe(
    map((ingredients) => ingredients.filter((ingredient) => ingredient.name)),
    tap(() => (this.loading = false))
  );

  private selectedIngredients: Ingredient[] = [];
  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private ingredientDiscoveryService: IngredientDiscoveryService,
    private calorieBarService: CalorieBarService,
    private platform: Platform,

  ) {}

  public async onSearchChanged($event: any): Promise<void> {
    this.nameSearchAction.next($event.target.value);
  }

  ngOnInit() {}

  public async scanBarcode(): Promise<void> {
    const scannerResult = await this.barcodeScannerService.openBarcodeScanner();
    if (scannerResult) {
      this.barcodeSearchAction.next(scannerResult);
    }
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

  onIngredientModalClose() {
    this.ingredientSelectedAction.next(undefined);
  }

  onClick(ingredient: Ingredient) {
    this.ingredientSelectedAction.next(ingredient);
  }
}
