import { api } from "@/lib/api";
import type {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  TransactionType,
} from "@bcl/types";

function cleanParams(params: Record<string, any>): Record<string, string | number | boolean> {
  return Object.entries(params).reduce(
    (acc, [key, value]) => {
      if (value !== null && value !== undefined && value !== "") {
        acc[key] = value;
      }
      return acc;
    },
    {} as Record<string, string | number | boolean>,
  );
}

export function getTransactionsAcrossPlatform(params: {
  page: number;
  limit: number;
  type?: TransactionType | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}): Promise<ApiResponse<PaginatedResponse<Transaction & { user?: { firstName: string; lastName: string; email: string } }>>> {
  return api.get<PaginatedResponse<Transaction & { user?: { firstName: string; lastName: string; email: string } }>>(
    "/v1/transactions",
    cleanParams(params),
  );
}
