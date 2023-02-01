import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { filter, map, switchMap, take, tap } from "rxjs/operators";
import {
  BehaviorSubject,
  combineLatest,
  from,
  lastValueFrom,
  merge,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { BarcodeScannerService } from '../../../barcode-scanner.service';
import { Ingredient } from '../../../interfaces/ingredient';
import { CalorieBarService } from '../../data-access/calorie-bar.service';
import { IngredientDiscoveryService } from '../../../ingredient-discovery.service';
import { Platform, ToastController } from '@ionic/angular';
import { DiaryService } from '../../data-access/diary.service';
import { ExternalIngredient } from '../../../interfaces/external-ingredient';
import { IngredientService } from '../../../ingredient.service';
import { v4 } from 'uuid';
import { UserSettingsService } from '../../../user-settings.service';
import { FormControl } from "@angular/forms";
import { isNotUndefinedOrNull } from "../../../../utils";

// eslint-disable-next-line @typescript-eslint/ban-types

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search.component.html',
  styleUrls: ['./ingredient-search.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IngredientSearchComponent implements OnInit {

  public textSearch = new FormControl<string | undefined>(undefined);
  private barcodeSearchAction = new Subject<string>();
  private ingredientSelectedAction = new Subject<ExternalIngredient>();
  private selectedIngredient$ = this.ingredientSelectedAction.asObservable();

  private mealCategories$ = this.userSettingsService
    .queryUserSettings()
    .pipe(map((userSettings) => userSettings.mealCategories));


  private modalHeight$ = of(this.platform.height()).pipe(
    map((height) => 450 / height)
  );

  modalInput$: Observable<{
    selectedIngredient: ExternalIngredient;
    mealCategories: string[];
    modalHeight: number;
  }> = combineLatest([this.selectedIngredient$, this.mealCategories$, this.modalHeight$]).pipe(
    map(([selectedIngredient, mealCategories, modalHeight]) => ({
      selectedIngredient,
      mealCategories,
      modalHeight
    }))
  );

  public loading = false;

  public barcodeSearchResult$ = this.barcodeSearchAction.pipe(
    tap(() => (this.loading = true)),
    switchMap((barcode) =>
      this.ingredientDiscoveryService.queryIngredientsByBarcode(barcode)
    )
  );
  public nameSearchResult$ = this.textSearch.valueChanges.pipe(
    filter(isNotUndefinedOrNull),
    tap(() => (this.loading = true)),
    switchMap((name) =>
      this.ingredientDiscoveryService.queryIngredientsByName(name)
    )
  );

  public ingredientSearchResult$: Observable<ExternalIngredient[]> = merge(
    this.barcodeSearchResult$,
    this.nameSearchResult$
  ).pipe(
    tap(() => (this.loading = false)),
    map((ingredients) => ingredients.filter((ingredient) => ingredient.name))
  );

  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private ingredientDiscoveryService: IngredientDiscoveryService,
    private calorieBarService: CalorieBarService,
    private platform: Platform,
    private ingredientService: IngredientService,
    private diaryService: DiaryService,
    private userSettingsService: UserSettingsService,
    private toastController: ToastController
  ) {}

  ngOnInit() {}

  public async scanBarcode(): Promise<void> {
    const scannerResult = await this.barcodeScannerService.openBarcodeScanner();
    if (scannerResult) {
      this.barcodeSearchAction.next(scannerResult);
    }
  }

  onIngredientSelected(ingredient: ExternalIngredient) {
    this.ingredientSelectedAction.next(ingredient);
  }

  onAddIngredient(
    { name, brand, macros, amount }: ExternalIngredient,
    selectedMealCategory: string
  ) {
    void lastValueFrom(
      this.diaryService.selectedDate$.pipe(
        take(1),
        switchMap((date) =>
          this.ingredientService.create(
            new Ingredient(
              v4(),
              name,
              brand,
              macros,
              amount,
              selectedMealCategory,
              date
            )
          )
        ),
        switchMap(() =>
          from(
            this.toastController.create({
              message: 'Added to diary',
              duration: 1000,
              color: 'success',
              icon: 'checkmark-circle-outline',
            })
          ).pipe(tap((toast) => toast.present()))
        )
      )
    );
  }
}
