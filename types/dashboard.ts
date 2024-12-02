export interface SubjectStats {
  name: string;
  count: number;
  percentage: number;
}

export interface BranchStats {
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
  topBranches: BranchStats[];
  dateRange: DateRange;
  lastUpdated: string;
}

export interface DashboardResponse {
  success: boolean;
  error?: string;
  data?: DashboardData;
}
