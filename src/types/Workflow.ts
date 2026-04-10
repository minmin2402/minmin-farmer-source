// src/types/workflow.ts
export interface Workflow {
  id: string;
  name: string;
  nodes: any[]; // Cấu trúc JSON bạn vừa gửi
  edges: any[];
  lastUpdated: number;
}

