import { TestBed } from '@angular/core/testing';

import { AccessruleService } from './accessrule.service';

describe('AccessruleService', () => {
  let service: AccessruleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AccessruleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
