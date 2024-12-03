export interface LPCCSv2ResponseMock {
    documentType: "CONTEXT";
    tenantId: string;
    documentKey: string;
    accountId: string;
    nameSpace: string;
    ttl: string; // ISO 8601 date string
    payload: {
      totalConversations: number;
      topSubjects: {
        name: string;
        count: number;
        percentage: number;
      }[];
      topBranches: {
        name: string;
        count: number;
        percentage: number;
      }[];
      dateRange: {
        startDate: string; // ISO 8601 date string (e.g., "YYYY-MM-DD")
        endDate: string;   // ISO 8601 date string (e.g., "YYYY-MM-DD")
      };
      lastUpdated: string; // ISO 8601 date string
    };
  }

export interface LPCCSv2Request {
  tenantId: string;
  documentKey: string;
}

export interface LPCCSv2Response {
  id: string;
  tenantId: string;
  documentKey: string;
  documentData: {
    [key: string]: any;
  };
  metadata: {
    createdAt: string;
    updatedAt: string;
    version: number;
  };
}