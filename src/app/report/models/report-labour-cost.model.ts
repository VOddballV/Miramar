
export interface IColumn {
    description:       string;
    key:               string;
    descending?:       boolean;
    current?:          boolean;
    default?:          any;
    isPercent?:        boolean;
    border?:           boolean;
    align?:            boolean;
    large?:            boolean;
}

export interface IReportData {
    providers:         IRecord[];
    directContractors: IRecord[];
    total:             IRecord[] | IRecord;
}

export interface IRecord {
    rebatesTotal:      number;
    grossPayTotal:     number;
    workerCount:       number;
    complianceStats:   IComplianceStats | null;
    complianceScore:   number | null;
    payrollAdminTotal: number;
    labourCostTotal:   number;
    providerId:        number;
    name:              string;
}

export interface IComplianceStats {
    OpsEmpStatusChecked: number;
    Total:               number;
    TaxStatus:           number;
    Identification:      number;
    RightToWork:         number;
    OpsChecked:          number;
    Contract:            number;
    EmpStatusReview:     number;
}

export class ReportResult {
    constructor(
        public report: IRecord[],
        public data: ReportData
    ) {
    }
}

export class ReportData implements IReportData {
    providers:         IRecord[];
    directContractors: IRecord[];
    total:             IRecord;
}

export enum ColumnKey {
    NAME = 'name',
    WORKER_COUNT = 'workerCount',
    COMPLIANCE_SCORE = 'complianceScore',
    GROSS_PAY_TOTAL = 'grossPayTotal',
    PAYROLL_ADMIN_TOTAL = 'payrollAdminTotal',
    LABOUR_COST_TOTAL = 'labourCostTotal',
    REBATES_TOTAL = 'rebatesTotal'
}
