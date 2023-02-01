import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Ingredient } from '../../interfaces/ingredient';
import { DiaryService } from '../../data-access/diary.service';
import { ActivatedRoute, Router } from '@angular/router';
import { lastValueFrom } from 'rxjs';
import { IngredientService } from '../../data-access/ingredient.service';

@Component({
  selector: 'app-diary',
  templateUrl: './diary.component.html',
  styleUrls: ['./diary.component.sass'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DiaryComponent implements OnInit {
  $vm = this.diaryService.diaryDay$.pipe(
    map((diaryDay) => ({ ...diaryDay })),
  );

  constructor(
    public diaryService: DiaryService,
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public ingredientService: IngredientService,
  ) {}

  ngOnInit(): void {}

  onDeleteIngredient(ingredient: Ingredient) {
    void lastValueFrom(this.ingredientService.delete(ingredient.id));
  }

  routeToSearch() {
    void this.router.navigate(['search'], { relativeTo: this.activatedRoute });
  }
}
