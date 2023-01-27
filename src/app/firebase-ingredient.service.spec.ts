import { TestBed } from '@angular/core/testing';

import { FirebaseIngredientService } from './user-ingredient.service';

describe('UserIngredientService', () => {
  let service: FirebaseIngredientService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseIngredientService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
