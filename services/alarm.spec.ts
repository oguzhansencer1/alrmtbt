import { TestBed } from '@angular/core/testing';

import { Alarm } from './alarm';

describe('Alarm', () => {
  let service: Alarm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Alarm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
