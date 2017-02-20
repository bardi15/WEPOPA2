/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BotsService } from './bots.service';

describe('BotsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BotsService]
    });
  });

  it('should ...', inject([BotsService], (service: BotsService) => {
    expect(service).toBeTruthy();
  }));
});
