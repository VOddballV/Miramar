import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportLabourCostComponent } from './report-labour-cost.component';

describe('ReportLabourCostComponent', () => {
  let component: ReportLabourCostComponent;
  let fixture: ComponentFixture<ReportLabourCostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportLabourCostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportLabourCostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
