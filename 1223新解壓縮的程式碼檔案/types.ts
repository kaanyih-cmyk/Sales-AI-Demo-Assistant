
export interface TrendItem {
  title: string;
  content: string;
}

export interface PainPointItem {
  title: string;
  content: string;
}

export interface ReportData {
  trends: TrendItem[];
  painPoints: PainPointItem[];
}

export interface SystexSolution {
  title: string;
  description: string;
  department: string;
  reason: string;
  salesPitch: string;
  targetPainPoint: string;
}

export enum Industry {
  RETAIL = '零售與電商',
  FINANCE = '金融保險',
  MANUFACTURING = '製造業',
  HEALTHCARE = '醫療保健',
  TECHNOLOGY = '科技與資訊',
  LOGISTICS = '物流運籌'
}
