import { TestBed } from '@angular/core/testing';

import { GlobalMatSelectService } from './global-mat-select.service';

describe('GlobalMatSearchService', () => {
  let service: GlobalMatSelectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalMatSelectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
