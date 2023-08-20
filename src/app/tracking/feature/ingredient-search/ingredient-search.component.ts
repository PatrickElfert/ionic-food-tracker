import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { catchError, filter, map, switchMap, take, tap } from 'rxjs/operators';
import {
  combineLatest,
  EMPTY,
  from,
  lastValueFrom,
  merge,
  Observable,
  of,
  Subject,
} from 'rxjs';
import { BarcodeScannerService } from '../../../shared/data-access/barcode-scanner.service';
import { Ingredient } from '../../interfaces/ingredient';
import { CalorieBarService } from '../../data-access/calorie-bar.service';
import { IngredientDiscoveryService } from '../../data-access/ingredient-discovery.service';
import { IonicModule, Platform, ToastController } from '@ionic/angular';
import { DiaryService } from '../../data-access/diary.service';
import { ExternalIngredient } from '../../interfaces/external-ingredient';
import { IngredientService } from '../../data-access/ingredient.service';
import { v4 } from 'uuid';
import { UserSettingsService } from '../../../shared/data-access/user-settings.service';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { isNotUndefinedOrNull } from '../../../shared/utils/utils';
import { AsyncPipe, CommonModule, NgForOf, NgIf } from '@angular/common';
import { IngredientSearchItemComponent } from '../../ui/ingredient-search-item/ingredient-search-item.component';
import { AddIngredientComponent } from '../../ui/add-ingredient/add-ingredient.component';
import { ToastService } from 'src/app/shared/data-access/toast.service';

@Component({
  selector: 'app-ingredient-search-modal',
  templateUrl: './ingredient-search.component.html',
  styleUrls: ['./ingredient-search.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    ReactiveFormsModule,
    IonicModule,
    IngredientSearchItemComponent,
    AsyncPipe,
    AddIngredientComponent,
    NgIf,
    NgForOf
  ]
})
export class IngredientSearchComponent implements OnInit {
  public searchbar = new FormControl<string | undefined>(undefined);
  private barcodeSearchAction = new Subject<string>();
  private ingredientSelectedAction = new Subject<
    ExternalIngredient | undefined
  >();

  private barcodeSearchResult$ = this.barcodeSearchAction.pipe(
    tap(() => (this.loading = true)),
    switchMap((barcode) =>
      this.ingredientDiscoveryService.queryIngredientsByBarcode(barcode)
    )
  );
  private textSearchResult$ = this.searchbar.valueChanges.pipe(
    filter(isNotUndefinedOrNull),
    tap(() => (this.loading = true)),
    switchMap((name) =>
      this.ingredientDiscoveryService.queryIngredientsByName(name)
    )
  );

  public ingredientSearchResult$: Observable<ExternalIngredient[]> = merge(
    this.barcodeSearchResult$,
    this.textSearchResult$
  ).pipe(
    map((ingredients) => ingredients.filter((ingredient) => ingredient.name)),
    catchError((error) =>
      from(this.toastService.showErrorToast(error.message)).pipe(map(() => []))
    ),
    tap(() => (this.loading = false))
  );

  public loading = false;

  public selectedIngredient$ = this.ingredientSelectedAction.asObservable();
  private mealCategories$ = this.userSettingsService
    .queryUserSettings()
    .pipe(map((userSettings) => userSettings.mealCategories));

  private modalHeight$ = of(this.platform.height()).pipe(
    map((height) => 450 / height)
  );

  public modalInput$: Observable<{
    selectedIngredient: ExternalIngredient;
    mealCategories: string[];
    modalHeight: number;
  }> = combineLatest([
    this.ingredientSelectedAction
      .asObservable()
      .pipe(filter(isNotUndefinedOrNull)),
    this.mealCategories$,
    this.modalHeight$,
  ]).pipe(
    map(([selectedIngredient, mealCategories, modalHeight]) => ({
      selectedIngredient,
      mealCategories,
      modalHeight,
    }))
  );
  constructor(
    private barcodeScannerService: BarcodeScannerService,
    private ingredientDiscoveryService: IngredientDiscoveryService,
    private platform: Platform,
    private ingredientService: IngredientService,
    private diaryService: DiaryService,
    private userSettingsService: UserSettingsService,
    private toastService: ToastService
  ) {}

  ngOnInit() {}

  public async onScanBarcode(): Promise<void> {
    const scannerResult = await this.barcodeScannerService.openBarcodeScanner();
    if (scannerResult) {
      this.barcodeSearchAction.next(scannerResult);
    }
  }

  public onIngredientSelected(ingredient: ExternalIngredient) {
    this.ingredientSelectedAction.next(ingredient);
  }

  public onAddIngredient(
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
        switchMap(() => from(this.toastService.showErrorToast('Added to diary')))
      )
    );
  }

  public onModalDismiss() {
    this.ingredientSelectedAction.next(undefined);
  }
}
