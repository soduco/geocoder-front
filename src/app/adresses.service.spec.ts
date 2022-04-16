import { TestBed } from '@angular/core/testing';

import { AdressesService } from './adresses.service';

describe('AdressesService', () => {
  let service: AdressesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdressesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
