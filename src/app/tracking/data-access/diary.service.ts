import { addDays } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan, shareReplay } from 'rxjs/operators';
import { Meal } from '../interfaces/meal';
import { Injectable } from '@angular/core';

@Injectable()
export abstract class DiaryService {
  public selectedDateChangedAction = new BehaviorSubject<number>(0);
  public selectedDate$ = this.selectedDateChangedAction.pipe(
    scan((currentDate,increment) => addDays(currentDate, increment), new Date()),
    shareReplay(1),
  );

  abstract diaryDay$: Observable<DiaryDay>;

  public nextDay() {
    this.selectedDateChangedAction.next(1);
  }

  public previousDay() {
    this.selectedDateChangedAction.next(-1);
  }
}

export interface DiaryDay {
  date: Date;
  meals: Meal[];
}
