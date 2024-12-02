export interface SubjectStats {
  name: string;
  count: number;
  percentage: number;
}

export interface DateRange {
  startDate: string;
  endDate: string;
}

export interface DashboardData {
  totalConversations: number;
  topSubjects: SubjectStats[];
  dateRange: DateRange;
  lastUpdated: string;
}

export interface DashboardResponse {
  success: boolean;
  error?: string;
  data?: DashboardData;
}
