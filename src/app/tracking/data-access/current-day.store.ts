import { createAdapter } from '@state-adapt/core';
import { addDays } from 'date-fns';
import { adapt } from '@state-adapt/angular';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrentDayStore {
  private currentDayAdapter = createAdapter<Date>()({
    nextDay: (state) => addDays(state, 1),
    previousDay: (state) => addDays(state, -1),
    selectors: {
      currentDay: (state) => state,
    },
  });

  public store = adapt(new Date(), {
    adapter: this.currentDayAdapter,
    path: 'TrackingFeature.CurrentDay',
  });
}
