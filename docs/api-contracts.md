# API Contracts

All shared TypeScript types live in `packages/types/src/` and are exported from `@bcl/types`.
Never define API shapes inline in app code — always import from this package.

---

## Installation / Import

```ts
import type { User, ApiResponse, PaginatedResponse } from '@bcl/types'
```

---

## Common Types (`common.ts`)

### `ApiResponse<T>`

Standard wrapper for all single-resource API responses.

```ts
interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}
```

**Usage:**

```ts
const response: ApiResponse<User> = await fetchUser(id)
if (response.success) {
  console.log(response.data.email)
}
```

---

### `PaginatedResponse<T>`

Wrapper for list endpoints that support pagination.

```ts
interface PaginatedResponse<T> {
  data: T[]
  total: number        // total records matching the query
  page: number         // current page (1-indexed)
  pageSize: number     // records per page
  totalPages: number   // Math.ceil(total / pageSize)
}
```

**Usage:**

```ts
const response: PaginatedResponse<User> = await fetchUsers({ page: 1, pageSize: 20 })
console.log(`${response.total} users, page ${response.page} of ${response.totalPages}`)
```

---

### `ApiError`

Shape of error responses from the backend.

```ts
interface ApiError {
  message: string      // human-readable description
  code: string         // machine-readable error code (e.g. "USER_NOT_FOUND")
  statusCode: number   // HTTP status code
}
```

---

### `PaginationParams`

Query parameters accepted by paginated list endpoints.

```ts
interface PaginationParams {
  page?: number           // default: 1
  pageSize?: number       // default: 20
  sortBy?: string         // field name to sort by
  sortDirection?: SortDirection
}

type SortDirection = 'asc' | 'desc'
```

**Usage:**

```ts
async function fetchUsers(params: PaginationParams): Promise<PaginatedResponse<User>> {
  const query = new URLSearchParams(params as Record<string, string>)
  const res = await fetch(`/api/users?${query}`)
  return res.json()
}
```

---

## User Types (`user.ts`)

### `UserRole`

```ts
type UserRole = 'customer' | 'admin' | 'super_admin'
```

| Value          | Description                          |
|----------------|--------------------------------------|
| `customer`     | Standard end-user of the platform    |
| `admin`        | Can manage users and settings        |
| `super_admin`  | Full platform access                 |

---

### `UserStatus`

```ts
type UserStatus = 'active' | 'inactive' | 'suspended'
```

| Value       | Description                                      |
|-------------|--------------------------------------------------|
| `active`    | Can log in and use the platform                  |
| `inactive`  | Account exists but cannot log in                 |
| `suspended` | Temporarily blocked; requires admin action       |

---

### `User`

Full user entity returned by the API.

```ts
interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  role: UserRole
  status: UserStatus
  createdAt: string    // ISO 8601 datetime string
  updatedAt: string    // ISO 8601 datetime string
}
```

**Example:**

```json
{
  "id": "usr_01HV3K7ZRXY",
  "email": "jane@example.com",
  "firstName": "Jane",
  "lastName": "Doe",
  "role": "admin",
  "status": "active",
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-03-01T09:00:00Z"
}
```

---

### `CreateUserPayload`

Request body for `POST /api/users`.

```ts
interface CreateUserPayload {
  email: string
  firstName: string
  lastName: string
  role: UserRole
}
```

Note: `status` defaults to `'active'` on the backend; `id` and timestamps are server-generated.

---

### `UpdateUserPayload`

Request body for `PATCH /api/users/:id`. All fields are optional.

```ts
interface UpdateUserPayload {
  firstName?: string
  lastName?: string
  role?: UserRole
  status?: UserStatus
}
```

---

## Extending the Types Package

When adding new API types:

1. Create a new file in `packages/types/src/` (e.g. `product.ts`)
2. Define and export your interfaces there
3. Re-export from `packages/types/src/index.ts`:
   ```ts
   export * from './product'
   ```
4. Import in apps:
   ```ts
   import type { Product } from '@bcl/types'
   ```

Never create local type files in apps for data that comes from or goes to the API.
