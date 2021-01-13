import { TestBed } from '@angular/core/testing';

import { ReportLabourCostService } from './report-labour-cost.service';

describe('ReportLabourCostService', () => {
  let service: ReportLabourCostService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReportLabourCostService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
