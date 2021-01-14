import { Component, OnInit } from '@angular/core';
import { ReportData, IColumn, IRecord, ReportResult, ColumnKey } from '../../models/report-labour-cost.model';
import { ReportLabourCostService } from '../../services/report-labour-cost.service';
import { Observable } from 'rxjs';
import { tap, finalize } from 'rxjs/operators';
import { PercentPipe, DecimalPipe } from '@angular/common';
import { listAnimation } from '../../../animations/slide-in';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'report-labour-cost',
  templateUrl: './report-labour-cost.component.html',
  styleUrls: ['./report-labour-cost.component.scss'],
  animations: [listAnimation]
})
export class ReportLabourCostComponent implements OnInit {

  reportData = {} as ReportData;
  records: IRecord[] = [];
  columns: IColumn[] = [];
  isLoading: boolean = true;
  report$: Observable<ReportResult>;

  constructor(
    private reportLabourCostService: ReportLabourCostService,
    private percentPipe: PercentPipe,
    private decimalPipe: DecimalPipe,
    private ref: ChangeDetectorRef // Only added for animations to trigger change detection since isLoading was not seen
  ) { }

  ngOnInit(): void {
    this.columns = this.reportLabourCostService.getColumns();
    //  Created an observable so that we can use async pipe
    //  Another approach would be to add the subscription to a Subscriptions object
    //  Then unsubscribe with ngOnDestroy
    this.report$ = this.reportLabourCostService.getReportData().pipe(
      tap(
        (result: ReportResult) => {
          this.reportData = result.data;
          this.records = [...result.data.directContractors, ...result.data.providers];
          //  Default to descending Payroll Provider
          this.sort(this.columns.findIndex(x => x.key === ColumnKey.NAME));
        }
      ),
      finalize(
        () => {
          this.isLoading = false;
        }
      )
    );
  }

  sort = (index: number) => {
    //  Added for animations
    this.isLoading = true;
    this.ref.detectChanges()
  
    this.columns.forEach(col => col.current = false);
    this.columns[index].current = true;

    const property = this.columns[index].key;
    const desc = this.columns[index].descending;
    this.columns[index].descending = !desc;

    if (index > 0) {
      this.arrange(this.records, property, desc);
    }
    else { // sort by name
      this.arrange(this.reportData.directContractors, property, desc);
      this.arrange(this.reportData.providers, property, desc);
    }
    //  Added for animations
    this.isLoading = false;
  }

  arrange = (arr: IRecord[], property: string, direction: boolean) => {
    arr = direction ? arr.sort((a, b) => a[property] < b[property] ? -1 : (a[property] > b[property] ? 1 : 0)) :
                      arr.sort((b, a) => a[property] < b[property] ? -1 : (a[property] > b[property] ? 1 : 0));
  }

  /*
    Decided to continue with this method, but could have utilized the pipes in HTML.
    Could've used templates and ngif's in html which would've allowed me to use those pipes.
    Just like with any code—multiple ways to take over the world.
  */
  getCellData = (record: IRecord, cell: IColumn) => {
    //  Um wat
    // return `${record[cell.key] || cell.default} ${cell.trail || ''}`;
    let value = record[cell.key] || cell.default;
    if (typeof value === 'number') {
      if (cell.isPercent) {
        const percentFormat = cell.key === ColumnKey.REBATES_TOTAL ? '1.1' : '1.0';
        //  Divide by 100 to get a percentile number so we can use the percent pipe
        value = this.percentPipe.transform((value / 100), percentFormat);
      } else {
        value = this.decimalPipe.transform(value, '1.0-0');
      }
    }
    return value;
  }

  getColumnClasses = (column: IColumn) => {
    return {
      active: column.current,
      align: column.align,
      descending: column.current && column.descending,
      ascending: column.current && !column.descending
    };
  }

  getCellClasses = (cell: IColumn) => {
    return {
      active: cell.current,
      border: cell.border,
      align: cell.align,
      large: cell.large
    };
  }

}
