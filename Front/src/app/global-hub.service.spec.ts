import { TestBed } from '@angular/core/testing';

import { GlobalHubService } from './global-hub.service';

describe('GlobalHubService', () => {
  let service: GlobalHubService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GlobalHubService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
