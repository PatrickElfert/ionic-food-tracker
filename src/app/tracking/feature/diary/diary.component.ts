import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { ActionSheetController } from '@ionic/angular';
import { Ingredient } from '../../../interfaces/ingredient';
import { DiaryService } from '../../data-access/diary.service';
import { Meal } from '../../../interfaces/meal';
import { ActivatedRoute, Router } from "@angular/router";
import { lastValueFrom } from "rxjs";
import { IngredientService } from "../../../ingredient.service";

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
    this.router.navigate(['search'], { relativeTo: this.activatedRoute });
  }
}
