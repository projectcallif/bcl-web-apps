export type AuditAction =
  | "LOGIN"
  | "LOGOUT"
  | "CREATE_USER"
  | "UPDATE_USER"
  | "SUSPEND_USER"
  | "APPROVE_KYC"
  | "REJECT_KYC"
  | "APPROVE_LOAN"
  | "REJECT_LOAN"
  | "DISBURSE_LOAN"
  | "UPDATE_SETTINGS"
  | "SYSTEM_ALERT";

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: AuditAction;
  targetId?: string;
  targetName?: string;
  ipAddress: string;
  metadata: Record<string, any>;
}
