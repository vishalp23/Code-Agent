// Core Agent Types
export interface Agent {
  id: string;
  name: string;
  type: AgentType;
  capabilities: Capability[];
  llmProvider: LLMProvider;
  model: string;
  contextWindow: number;
  temperature: number;
  tools: Tool[];
  memory: AgentMemory;
  systemPrompt: string;
}

export enum AgentType {
  CODE_GENERATION = 'code',
  CHAT = 'chat',
  DEBUG = 'debug',
  TEST = 'test',
  REVIEW = 'review',
  REFACTOR = 'refactor',
  DOCUMENTATION = 'docs',
  SECURITY = 'security',
  PERFORMANCE = 'performance',
  CUSTOM = 'custom',
}

export interface Capability {
  name: string;
  description: string;
  enabled: boolean;
}

export enum LLMProvider {
  OPENAI = 'openai',
  ANTHROPIC = 'anthropic',
  AZURE = 'azure',
  GOOGLE = 'google',
  SELF_HOSTED = 'self-hosted',
}

export interface Tool {
  name: string;
  description: string;
  parameters: ToolParameter[];
  execute: (params: unknown) => Promise<ToolResult>;
  permissions: Permission[];
}

export interface ToolParameter {
  name: string;
  type: string;
  description: string;
  required: boolean;
  default?: unknown;
}

export interface ToolResult {
  success: boolean;
  data?: unknown;
  error?: string;
}

export interface Permission {
  resource: string;
  action: string;
}

export interface AgentMemory {
  shortTerm: ConversationHistory[];
  longTerm: VectorStore;
  workingMemory: Map<string, unknown>;
}

export interface ConversationHistory {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface VectorStore {
  add: (id: string, vector: number[], metadata: Record<string, unknown>) => Promise<void>;
  search: (query: number[], limit: number) => Promise<VectorSearchResult[]>;
  delete: (id: string) => Promise<void>;
}

export interface VectorSearchResult {
  id: string;
  score: number;
  metadata: Record<string, unknown>;
}

// Task Types
export interface Task {
  id: string;
  type: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  assignedAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

// User & Organization Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
}

export interface Organization {
  id: string;
  name: string;
  plan: SubscriptionPlan;
  settings: OrganizationSettings;
  createdAt: Date;
  updatedAt: Date;
}

export enum SubscriptionPlan {
  FREE = 'free',
  PROFESSIONAL = 'professional',
  TEAM = 'team',
  ENTERPRISE = 'enterprise',
}

export interface OrganizationSettings {
  allowedDomains: string[];
  ssoEnabled: boolean;
  maxUsers: number;
  features: string[];
}

// API Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: ApiError;
  metadata?: ResponseMetadata;
}

export interface ApiError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ResponseMetadata {
  timestamp: Date;
  requestId: string;
  version: string;
}
