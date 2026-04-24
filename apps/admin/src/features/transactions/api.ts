import { ApiHelper } from "@/helpers/ApiHelper";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  TransactionType,
} from "@bcl/types";

export function getTransactionsAcrossPlatform(params: {
  page: number;
  limit: number;
  type?: TransactionType | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}): Promise<
  ApiResponse<
    PaginatedResponse<
      Transaction & {
        user?: { firstName: string; lastName: string; email: string };
      }
    >
  >
> {
  return api.get<
    PaginatedResponse<
      Transaction & {
        user?: { firstName: string; lastName: string; email: string };
      }
    >
  >("/v1/transactions", ApiHelper.cleanParams(params));
}
