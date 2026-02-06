
export interface KPIMetric {
  name: string;
  target: number;
  actual: number;
  unit: string;
}

export interface AchievementRate {
  label: string;
  rate: number;
  type: 'success' | 'warning' | 'danger';
}

export interface CustomerProfileData {
  category: string;
  todayCount: number;
  monthCount: number;
}

export interface RelationshipManager {
  id: string;
  name: string;
  avatar: string;
  role: string;
  region: string;
  wealthIncome: string;
  wealthIncomeRate: number;
  wealthNetIncrease: string;
  wealthNetIncreaseRate: number;
  wealthCustomerNetIncrease: string;
  wealthCustomerNetIncreaseRate: number;
  completionRate: number;
  predictedRate: number;
  status: 'normal' | 'warning' | 'critical';
  rank: number;
  tags: string[];
  recentPerformance: string;
  yearTargetRate: number;
  monthTargetRate: number;
  yearSignal: 'red' | 'yellow';
  monthSignal: 'red' | 'yellow';
  totalScore: number;
}

export interface PerformanceSummary {
  period: 'today' | 'week' | 'month';
  content: string;
}

export interface OpportunityItem {
  id: string;
  title: string;
  description: string;
  priority: '高优' | '中优';
  source: string;
  sentAt: string;
}
