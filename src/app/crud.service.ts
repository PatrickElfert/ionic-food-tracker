import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { first, switchMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export abstract class CrudService<T> {
  constructor() {}

  private deleteAction = new Subject<T>();
  private setAction = new Subject<T>();
  private updateAction = new Subject<T>();

  public onSet$ = this.setAction.asObservable();
  public onDelete$ = this.deleteAction.asObservable();
  public onUpdate$ = this.updateAction.asObservable();

  protected abstract queryMeal(id: string): Observable<T>;
  protected abstract onDeleteMeal(id: string): Observable<void>;
  protected abstract onUpdateMeal(payload: Partial<T>): Observable<void>;
  protected abstract onSetMeal(payload: T): Observable<void>;

  public setMeal(payload: T) {
    this.onSetMeal(payload)
      .pipe(
        tap(() => this.setAction.next(payload)),
        first()
      )
      .subscribe();
  }

  public updateMeal(payload: Partial<T> & { id: string }) {
    this.onUpdateMeal(payload)
      .pipe(
        switchMap(() => this.queryMeal(payload.id)),
        tap((created) => this.updateAction.next(created)),
        first()
      )
      .subscribe();
  }

  public delete(payload: T) {
    this.onSetMeal(payload)
      .pipe(
        tap(() => this.deleteAction.next(payload)),
        first()
      )
      .subscribe();
  }
}
