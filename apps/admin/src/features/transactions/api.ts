import { ApiHelper } from "@/helpers/ApiHelper";
import { api } from "@/lib/api";
import type {
  ApiResponse,
  PaginatedResponse,
  Transaction,
  TransactionType,
  PaymentStatus,
  TransactionDetail,
} from "@bcl/types";

export function getTransactionsAcrossPlatform(params: {
  page: number;
  limit: number;
  type?: TransactionType | null;
  status?: PaymentStatus | null;
  userId?: string | null;
  loanId?: string | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  search?: string | null;
}): Promise<
  ApiResponse<
    PaginatedResponse<
      Transaction & {
        userName?: string;
      }
    >
  >
> {
  return api.get<
    PaginatedResponse<
      Transaction & {
        userName?: string;
      }
    >
  >("/v1/admin/transactions", ApiHelper.cleanParams(params));
}

export function getTransactionDetail(
  id: string,
): Promise<ApiResponse<TransactionDetail>> {
  return api.get<TransactionDetail>(`/v1/admin/transactions/${id}`);
}
