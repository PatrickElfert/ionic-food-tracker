import { addDays } from 'date-fns';
import { BehaviorSubject, Observable } from 'rxjs';
import { scan } from 'rxjs/operators';
import { Meal } from './interfaces/meal';

export abstract class DiaryService {
  public selectedDateChangedAction = new BehaviorSubject<number>(0);
  public selectedDate$ = this.selectedDateChangedAction.pipe(
    scan((currentDate,increment) => addDays(currentDate, increment), new Date()),
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
