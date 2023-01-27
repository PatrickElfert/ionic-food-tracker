import { TestBed } from '@angular/core/testing';

import { IngredientDiscoveryService } from './ingredient-discovery.service';

describe('IngredientDiscoveryService', () => {
  let service: IngredientDiscoveryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(IngredientDiscoveryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
