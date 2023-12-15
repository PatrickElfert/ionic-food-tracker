import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map, tap } from 'rxjs/operators';
import { Ingredient } from '../../interfaces/ingredient';
import { ActivatedRoute, Router } from '@angular/router';
import { combineLatest, lastValueFrom } from 'rxjs';
import { IngredientService } from '../../data-access/ingredient.service';
import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { CalorieBarComponent } from '../../ui/calorie-bar/calorie-bar.component';
import { IonicModule } from '@ionic/angular';
import { IngredientItemComponent } from '../../ui/ingredient-item/ingredient-item.component';
import { DiaryFacade } from '../../data-access/diary.facade';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [
    IonicModule,
    DatePipe,
    AsyncPipe,
    IngredientItemComponent,
    CalorieBarComponent,
    NgForOf,
    NgIf,
  ],
})
export class DiaryComponent implements OnInit {
  $vm = combineLatest([
    this.diaryFacade.todaysDiaryEntry$,
    this.diaryFacade.calorieLimit$,
  ]).pipe(
    map(([todaysDiaryEntry, calorieLimit]) => ({
      ...todaysDiaryEntry,
      calorieLimit,
    }))
  );

  constructor(
    public diaryFacade: DiaryFacade,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public ingredientService: IngredientService
  ) {}

  ngOnInit(): void {}

  onDeleteIngredient(ingredient: Ingredient) {
    void lastValueFrom(this.ingredientService.delete(ingredient.id));
  }

  routeToSearch() {
    void this.router.navigate(['search'], { relativeTo: this.activatedRoute });
  }
}
