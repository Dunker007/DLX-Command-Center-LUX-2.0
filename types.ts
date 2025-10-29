export interface Task {
  id: number;
  text: string;
  status: 'In Progress...' | 'Complete' | 'Failed';
  result?: string;
  timestamp: string;
}

export enum AIStatus {
  ACTIVE = 'ACTIVE',
  READY = 'READY',
}