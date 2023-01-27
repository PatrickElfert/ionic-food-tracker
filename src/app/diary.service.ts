import { Injectable } from '@angular/core';
import { format, addDays } from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { map, scan } from 'rxjs/operators';
import { Meal } from './interfaces/meal';

@Injectable({
  providedIn: 'root',
})
export abstract class DiaryService {
  public selectedDateChangedAction = new Subject<number>();
  public selectedDate$ = this.selectedDateChangedAction.pipe(
    scan((currentDate,increment) => addDays(currentDate, increment), new Date()),
    map((date) => this.formatDate(date)),
  );

  abstract meals: Observable<Meal[]>;

  public nextDay() {
    this.selectedDateChangedAction.next(1);
  }

  public previousDay() {
    this.selectedDateChangedAction.next(-1);
  }

  private formatDate(date: Date) {
    return format(date, 'cccc');
  }
}
