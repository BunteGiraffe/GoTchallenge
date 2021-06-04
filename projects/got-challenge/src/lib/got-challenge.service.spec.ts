import { TestBed } from '@angular/core/testing';

import { GotChallengeService } from './got-challenge.service';

describe('GotChallengeService', () => {
  let service: GotChallengeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GotChallengeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
