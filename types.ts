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

export interface IntelReport {
  title: string;
  summary: string;
  key_points: string[];
}

export enum IdeaStatus {
  NEW = 'New Idea',
  DISCUSSION = 'In Discussion',
  APPROVED = 'Approved',
  ARCHIVED = 'Archived',
}

export interface Idea {
  id: number;
  title: string;
  description: string;
  status: IdeaStatus;
  timestamp: string;
}

// New type for Knowledge Base
export interface KnowledgeEntry {
  id: number;
  title: string;
  content: string;
  tags: string[];
  source: string; // URL or reference like "G-Drive:/path/to/doc"
  timestamp: string;
}

// New enum for Crypto Lab
export enum CryptoOperation {
    ENCRYPT = 'encrypt',
    DECRYPT = 'decrypt',
    HASH = 'hash',
}
