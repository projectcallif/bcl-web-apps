export interface AppConfig {
  key: string;
  value: string;
  jsonValue: Record<string, unknown> | null;
  description: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SaveAppConfigPayload {
  value: string;
  description: string;
  isPublic: boolean;
}
