import { TestBed } from '@angular/core/testing';
import { DiaryService } from './diary.service';

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
