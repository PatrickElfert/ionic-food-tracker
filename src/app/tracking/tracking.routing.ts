import { Routes } from '@angular/router';
import { DiaryComponent } from './feature/diary/diary.component';
import { IngredientSearchComponent } from './feature/ingredient-search/ingredient-search.component';
import { FirebaseIngredientService } from './data-access/firebase-ingredient.service';
import { DiaryFacade } from './data-access/diary.facade';
import { IngredientService } from './data-access/ingredient.service';
import { OpenFoodFactsIngredientDiscoveryService } from './data-access/open-food-facts-ingredient-discovery.service';
import { IngredientDiscoveryService } from './data-access/ingredient-discovery.service';
import { CurrentDayStore } from './data-access/current-day.store';
import { MealsStore } from './data-access/meals.store';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'prefix',
    providers: [
      DiaryFacade,
      CurrentDayStore,
      MealsStore,
      { provide: IngredientService, useClass: FirebaseIngredientService },
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
