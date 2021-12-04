import { TestBed } from '@angular/core/testing';

import { CalorieBarService } from './calorie-bar.service';

describe('CalorieBarService', () => {
  let service: CalorieBarService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalorieBarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
