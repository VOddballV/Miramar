import { Injectable } from '@angular/core';
import { ReportData, IComplianceStats, ReportResult, IColumn, IReportData, ColumnKey } from '../models/report-labour-cost.model';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { CurrencySymbolPipe } from '../pipes/currency-symbol.pipe';


@Injectable({
  providedIn: 'root'
})
export class ReportLabourCostService {

  constructor(
    private http: HttpClient,
    private currencySymbol: CurrencySymbolPipe
  ) { }

  getReportData = (): Observable<ReportResult> => {
    return this.http.get<IReportData[]>(`${environment.apiBaseUrl}/application/labourstats`).pipe(
      map(res => {
        res[0].total = res[0].total[0];
        return res[0];
      }),
      switchMap(
        (reportData: ReportData) => {
          const records = [...reportData.directContractors, ...reportData.providers];
          let rebatesTotal = 0;
          records.forEach(
            record => {
              record.complianceScore = this.getComplianceScore(record.complianceStats);
              record.rebatesTotal = this.getRebatesTotal(record.workerCount, reportData.total.workerCount);
              record.grossPayTotal = this.moveDecimal(record.grossPayTotal, 2);
              record.labourCostTotal = this.moveDecimal(record.labourCostTotal, 2);
              rebatesTotal += record.rebatesTotal;
          });
          //  Looks like the sample didn't set these?
          //  Handle Totals
          reportData.total.rebatesTotal = rebatesTotal;
          reportData.total.complianceScore = reportData.total.complianceStats.Total;
          reportData.total.grossPayTotal = this.moveDecimal(reportData.total.grossPayTotal, 2);
          reportData.total.payrollAdminTotal = this.moveDecimal(reportData.total.payrollAdminTotal, 2);
          reportData.total.labourCostTotal = this.moveDecimal(reportData.total.labourCostTotal, 2);
          //  / Math.pow(10, 2)
          return of(new ReportResult(records, reportData));
        }
      )
    );
  }

  getColumns = (): IColumn[] => {
    return [
      { description: 'PAYROLL PROVIDER', key: ColumnKey.NAME},
      { description: 'WORKER', key: 'workerCount', large: true },
      { description: 'COMPLIANCE SCORE', key: ColumnKey.COMPLIANCE_SCORE, default: 0, isPercent: true, border: true },
      { description: `GROSS PAY (${this.currencySymbol.transform()})`, key: ColumnKey.GROSS_PAY_TOTAL, align: true, large: true },
      { description: `PAYROLL ADMIN (${this.currencySymbol.transform()})`, key: ColumnKey.PAYROLL_ADMIN_TOTAL, default: '-', align: true },
      { description: `LABOUR COST (${this.currencySymbol.transform()})`, key: ColumnKey.LABOUR_COST_TOTAL, border: true, align: true, large: true },
      { description: 'WORK FORCE', key: ColumnKey.REBATES_TOTAL, default: 0, isPercent: true },
    ];
  }

  getComplianceScore(complianceStats: IComplianceStats): number {
    // nothing seems to clearly explain how this score is calculated or mapped
    return complianceStats && complianceStats.Contract ? complianceStats.Total : 0;
  }

  //  Yeah backend isn't calculating the rebates total.
  getRebatesTotal = (workers: number, totalWorkers: number): number => {
    //  Multiple to whole number since that is what complianceScore is
    //  Maybe we don't want to use percent pipe in some places?
    return (workers / totalWorkers) * 100;
  }

  //  Moved to shared service
  moveDecimal = (value: number, spaces: number) => {
    return value / Math.pow(10, spaces);
  }
}
