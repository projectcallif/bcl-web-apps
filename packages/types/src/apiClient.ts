import type { ApiResponse } from './common'

// ── Interceptor types ────────────────────────────────────────────────────────

/** Mutable request descriptor passed through request interceptors. */
export interface RequestConfig {
  url: string
  method: string
  headers: Record<string, string>
  body?: string
}

/**
 * Called before every request. Use to inject auth headers, add
 * correlation IDs, etc. Return the (optionally modified) config.
 */
export type RequestInterceptor = (
  config: RequestConfig,
) => RequestConfig | Promise<RequestConfig>

/**
 * Called after every successful response. Use for logging, analytics,
 * or normalising response data. Return the (optionally modified) response.
 */
export type ResponseInterceptor = (
  response: ApiResponse<unknown>,
) => ApiResponse<unknown> | Promise<ApiResponse<unknown>>

/**
 * Called when a request fails (network error, non-2xx, or
 * `success: false` envelope). May return a modified error or re-throw.
 * If all interceptors return without throwing, the error is re-thrown.
 */
export type ErrorInterceptor = (
  error: ApiClientError,
) => ApiClientError | Promise<ApiClientError>

// ── Error ────────────────────────────────────────────────────────────────────

export class ApiClientError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly data: unknown

  constructor(
    statusCode: number,
    message: string,
    code = String(statusCode),
    data?: unknown,
  ) {
    super(message)
    this.name = 'ApiClientError'
    this.statusCode = statusCode
    this.code = code
    this.data = data
  }

  get isUnauthorized(): boolean { return this.statusCode === 401 }
  get isForbidden(): boolean    { return this.statusCode === 403 }
  get isNotFound(): boolean     { return this.statusCode === 404 }
  get isServerError(): boolean  { return this.statusCode >= 500 }
}

// ── Config & interface ───────────────────────────────────────────────────────

export interface ApiClientConfig {
  /** Base URL prepended to every request path, e.g. `https://api.bcl.io/v1`. */
  baseURL: string
  /**
   * Request timeout in milliseconds. Requests that exceed this are aborted
   * and throw an `ApiClientError` with code `TIMEOUT`. Defaults to 30 000 ms.
   */
  timeout?: number
  /** Headers merged into every request. */
  defaultHeaders?: Record<string, string>
}

export interface ApiClient {
  get<T>(
    path: string,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>>

  post<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  put<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>>
  delete<T>(path: string): Promise<ApiResponse<T>>

  /** Add or overwrite a header on the shared headers bag. */
  setHeader(key: string, value: string): void
  /** Remove a header from the shared headers bag. */
  removeHeader(key: string): void

  addRequestInterceptor(interceptor: RequestInterceptor): void
  addResponseInterceptor(interceptor: ResponseInterceptor): void
  addErrorInterceptor(interceptor: ErrorInterceptor): void
}

// ── Factory ──────────────────────────────────────────────────────────────────

export function createApiClient(config: ApiClientConfig): ApiClient {
  const TIMEOUT = config.timeout ?? 30_000

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...config.defaultHeaders,
  }

  const requestInterceptors: RequestInterceptor[]   = []
  const responseInterceptors: ResponseInterceptor[] = []
  const errorInterceptors: ErrorInterceptor[]       = []

  async function handleError(error: ApiClientError): Promise<never> {
    let current = error
    for (const interceptor of errorInterceptors) {
      current = await interceptor(current)
    }
    throw current
  }

  async function request<T>(
    method: string,
    path: string,
    body?: unknown,
    params?: Record<string, string | number | boolean>,
  ): Promise<ApiResponse<T>> {
    // Build URL
    let url = `${config.baseURL}${path}`
    if (params && Object.keys(params).length > 0) {
      const qs = new URLSearchParams(
        Object.entries(params).map(([k, v]) => [k, String(v)]),
      ).toString()
      url += `?${qs}`
    }

    // Build request config
    let requestConfig: RequestConfig = {
      url,
      method,
      headers: { ...headers },
      ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
    }

    // Run request interceptors
    for (const interceptor of requestInterceptors) {
      requestConfig = await interceptor(requestConfig)
    }

    const { url: finalUrl, ...fetchConfig } = requestConfig

    // Timeout support via AbortController
    const controller = new AbortController()
    const timeoutId  = setTimeout(() => controller.abort(), TIMEOUT)

    let raw: Response
    try {
      raw = await fetch(finalUrl, { ...fetchConfig, signal: controller.signal })
    } catch (err) {
      const isTimeout = err instanceof DOMException && err.name === 'AbortError'
      return handleError(
        new ApiClientError(
          0,
          isTimeout
            ? `Request timed out after ${TIMEOUT}ms.`
            : 'Network error — check your connection.',
          isTimeout ? 'TIMEOUT' : 'NETWORK_ERROR',
        ),
      )
    } finally {
      clearTimeout(timeoutId)
    }

    // Parse JSON body
    let envelope: ApiResponse<T>
    try {
      envelope = (await raw.json()) as ApiResponse<T>
    } catch {
      return handleError(
        new ApiClientError(raw.status, 'Failed to parse server response.', 'PARSE_ERROR'),
      )
    }

    // Treat HTTP errors and envelope-level failures uniformly
    if (!raw.ok || !envelope.success) {
      return handleError(
        new ApiClientError(
          envelope.statusCode ?? raw.status,
          envelope.message  ?? 'Request failed.',
          String(envelope.statusCode ?? raw.status),
          envelope.data,
        ),
      )
    }

    // Run response interceptors
    let response: ApiResponse<unknown> = envelope
    for (const interceptor of responseInterceptors) {
      response = await interceptor(response)
    }

    return response as ApiResponse<T>
  }

  return {
    get:   (path, params) => request('GET',    path, undefined, params),
    post:  (path, body)   => request('POST',   path, body),
    put:   (path, body)   => request('PUT',    path, body),
    patch: (path, body)   => request('PATCH',  path, body),
    delete:(path)         => request('DELETE', path),

    setHeader:    (key, value) => { headers[key] = value },
    removeHeader: (key)        => { delete headers[key] },

    addRequestInterceptor:  (i) => { requestInterceptors.push(i) },
    addResponseInterceptor: (i) => { responseInterceptors.push(i) },
    addErrorInterceptor:    (i) => { errorInterceptors.push(i) },
  }
}
