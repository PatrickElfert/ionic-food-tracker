import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import {
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import {
  BehaviorSubject,
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
    ExternalIngredient | undefined
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

  public ingredientSearchResult$: Observable<ExternalIngredient[]> = merge(
    this.barcodeSearchResult$,
    this.nameSearchResult$
  ).pipe(
    tap(() => (this.loading = false)),
    map((ingredients) => ingredients.filter((ingredient) => ingredient.name))
  );
  mealCategories$ = this.userSettingsService.queryUserSettings().pipe(
    map((userSettings) => userSettings.mealCategories)
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

  onIngredientModalClose() {
    this.ingredientSelectedAction.next(undefined);
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
