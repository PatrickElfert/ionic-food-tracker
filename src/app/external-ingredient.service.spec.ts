import { TestBed } from '@angular/core/testing';

import { DefaultIngredientDiscoveryService } from './external-ingredient.service';

describe('ExternalIngredientService', () => {
  let service: DefaultIngredientDiscoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DefaultIngredientDiscoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
