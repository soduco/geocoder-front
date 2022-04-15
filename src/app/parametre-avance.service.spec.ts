import { TestBed } from '@angular/core/testing';

import { ParametreAvanceService } from './parametre-avance.service';

describe('ParametreAvanceService', () => {
  let service: ParametreAvanceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParametreAvanceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
