import { Routes } from '@angular/router';
import { DiaryComponent } from './feature/diary/diary.component';
import { IngredientSearchComponent } from './feature/ingredient-search/ingredient-search.component';
import { FirebaseIngredientService } from './data-access/firebase-ingredient.service';
import { DefaultDiaryService } from './data-access/default-diary.service';
import { IngredientService } from './data-access/ingredient.service';
import { DiaryService } from './data-access/diary.service';
import { OpenFoodFactsIngredientDiscoveryService } from './data-access/open-food-facts-ingredient-discovery.service';
import { CalorieBarService } from './data-access/calorie-bar.service';
import { IngredientDiscoveryService } from './data-access/ingredient-discovery.service';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      { provide: CalorieBarService },
      { provide: IngredientService, useClass: FirebaseIngredientService },
      { provide: DiaryService, useClass: DefaultDiaryService },
      {
        provide: IngredientDiscoveryService,
        useClass: OpenFoodFactsIngredientDiscoveryService,
      },
    ],
    children: [
      {
        path: '',
        component: DiaryComponent,
      },
      { path: 'search', component: IngredientSearchComponent },
    ],
  },
];


