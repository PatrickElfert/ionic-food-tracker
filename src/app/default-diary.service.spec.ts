import { TestBed } from '@angular/core/testing';

import { DiaryService } from './date.service';

describe('DateService', () => {
  let service: DiaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DiaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
