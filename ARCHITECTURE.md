# Nafi BackOffice - Architecture Documentation

## Overview

This document describes the architecture, design decisions, and best practices for the Nafi BackOffice application.

## Architecture Principles

### 1. Modular, Domain-Driven Design
- Features organized into **vertical modules** (`modules/*`)
- Each module is self-contained with its own API, store, components, pages, and routes
- Shared code lives in `shared/` only if truly generic across domains

### 2. Separation of Concerns
- **app/**: Application core (routing, global state, configuration)
- **modules/**: Business logic organized by domain (auth, dashboard, etc.)
- **shared/**: Reusable, domain-agnostic code
- **infrastructure/**: External integrations (HTTP, logging, auth)

### 3. State Management Strategy
**Two-tier state management:**
- **Pinia**: Client-side state (auth, UI preferences, local state)
- **TanStack Query**: Server-side state (API data, caching, refetching)

**Rule**: Never store large API responses in Pinia. Use TanStack Query for all server data.

## Project Structure

```
nafi-backoffice/
├── src/
│   ├── app/                      # 🏛️ Application Core
│   │   ├── App.vue              # Root component
│   │   ├── main.ts              # Entry point
│   │   ├── router/
│   │   │   ├── index.ts         # Router instance + guards
│   │   │   └── routes.ts        # Route aggregation
│   │   ├── stores/
│   │   │   ├── app.store.ts     # Global app state
│   │   │   └── user.store.ts    # User/auth state
│   │   ├── config/
│   │   │   ├── env.ts           # Environment config
│   │   │   └── permissions.ts   # RBAC permissions
│   │   ├── plugins/
│   │   │   └── vue-query.ts     # TanStack Query setup
│   │   └── layouts/
│   │       └── AppShell.vue     # Main layout with sidebar
│   │
│   ├── modules/                  # 📦 Feature Modules
│   │   ├── auth/
│   │   │   ├── api/             # Auth API calls
│   │   │   │   └── auth.api.ts
│   │   │   ├── composables/     # Auth composables
│   │   │   │   └── useLogin.ts
│   │   │   ├── pages/
│   │   │   │   └── LoginPage.vue
│   │   │   ├── layouts/
│   │   │   │   └── AuthLayout.vue
│   │   │   └── routes.ts        # Auth routes
│   │   │
│   │   └── dashboard/
│   │       ├── pages/
│   │       │   └── HomePage.vue
│   │       └── routes.ts
│   │
│   ├── shared/                   # 🔧 Shared Resources
│   │   ├── ui/                  # Design system
│   │   ├── components/
│   │   │   ├── NotFoundPage.vue
│   │   │   └── ForbiddenPage.vue
│   │   ├── composables/
│   │   │   └── useCan.ts        # Permission checking
│   │   ├── utils/
│   │   ├── types/
│   │   │   └── user.ts
│   │   └── directives/
│   │
│   └── infrastructure/           # 🔌 External Integrations
│       ├── http/
│       │   ├── client.ts        # Axios instance
│       │   └── interceptors.ts  # Auth & error handling
│       ├── auth/
│       │   └── token-storage.ts
│       └── logging/
│           └── sentry.ts
│
├── .env                          # Environment variables
├── vite.config.ts               # Vite configuration
├── tsconfig.app.json            # TypeScript config
└── README.md                    # Project documentation
```

## Core Concepts

### Routing & Navigation

#### Route Meta Fields
```typescript
{
  path: '/dashboard',
  component: DashboardPage,
  meta: {
    requiresAuth: true,          // Requires authentication
    guestOnly: false,            // Only for non-authenticated users
    permissions: ['dashboard.view'], // Required permissions
    public: false,               // Public route (no auth check)
    title: 'Dashboard'           // Page title
  }
}
```

#### Navigation Guards
Global guard in `app/router/index.ts`:
1. Bootstrap user session if not initialized
2. Check if route requires authentication
3. Check if user has required permissions
4. Redirect to login or forbidden page if needed

### State Management

#### When to use Pinia
```typescript
// ✅ Good use cases
- Current user & auth state
- UI toggles (sidebar, theme, modals)
- Form wizard state
- Local filters (not synced with server)

// ❌ Avoid
- Large lists from API
- Server-fetched data
- Data that needs caching/refetching
```

#### When to use TanStack Query
```typescript
// ✅ Good use cases
- API lists and resources
- Paginated data
- Real-time data that needs refetching
- Data with dependencies

// Example
const { data, isLoading } = useQuery({
  queryKey: ['orders', page],
  queryFn: () => ordersApi.list({ page })
})
```

### HTTP Client

#### Axios Interceptors
**Request Interceptor:**
- Add authorization headers (if using bearer tokens)
- Add correlation IDs for tracing
- Add CSRF tokens

**Response Interceptor:**
- Handle 401 (redirect to login)
- Handle 403 (redirect to forbidden)
- Global error logging

### Authentication & Authorization

#### Authentication Flow
1. User submits login form
2. `useLogin` composable calls `authApi.login()`
3. On success, user data stored in `userStore`
4. Router redirects to dashboard or original destination

#### Authorization (RBAC)
Permissions defined in `app/config/permissions.ts`:
```typescript
export const PERMISSIONS = {
  DASHBOARD_VIEW: 'dashboard.view',
  USERS_CREATE: 'users.create',
  // ...
}
```

Check permissions:
```typescript
const { can } = useCan()
if (can('orders.view')) {
  // Show orders
}
```

### Module Creation

To add a new module (e.g., `orders`):

```bash
# 1. Create folder structure
mkdir -p src/modules/orders/{api,store,components,pages}

# 2. Create routes file
cat > src/modules/orders/routes.ts << EOF
import type { RouteRecordRaw } from 'vue-router'

export const ordersRoutes: RouteRecordRaw[] = [
  {
    path: 'orders',
    name: 'orders.list',
    component: () => import('./pages/OrdersListPage.vue'),
    meta: { requiresAuth: true, permissions: ['orders.view'] }
  }
]
EOF

# 3. Add to app/router/routes.ts
# Import and add to children array
```

### Security Best Practices

#### Frontend Security
- ✅ Never use `v-html` with untrusted content
- ✅ Always validate input on both client and server
- ✅ Use HttpOnly cookies for auth tokens
- ✅ Implement CSRF protection on backend
- ✅ Set strict CSP headers
- ✅ Regular `npm audit` for vulnerabilities

#### XSS Prevention
```vue
<!-- ❌ Bad: v-html with user content -->
<div v-html="userContent"></div>

<!-- ✅ Good: Text interpolation -->
<div>{{ userContent }}</div>

<!-- ✅ Good: Sanitized HTML (if absolutely needed) -->
<div v-html="sanitize(userContent)"></div>
```

### Performance Optimization

#### Code Splitting
All routes are lazy-loaded:
```typescript
{
  path: '/orders',
  component: () => import('./pages/OrdersPage.vue')
}
```

#### TanStack Query Caching
```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,  // 1 minute
      retry: 1,
      refetchOnWindowFocus: false
    }
  }
})
```

#### Bundle Optimization
- Lazy-load heavy modules
- Use `shallowRef` for large non-reactive objects
- Avoid unnecessary watchers
- Use virtual scrolling for large lists

## Development Workflow

### Adding a New Feature

1. **Plan the module structure**
   - Identify domain (e.g., `orders`, `invoices`)
   - List required pages and components

2. **Create module files**
   ```bash
   mkdir -p src/modules/[name]/{api,store,components,pages}
   ```

3. **Define API layer**
   ```typescript
   // modules/[name]/api/[name].api.ts
   export const ordersApi = {
     async list() { /* ... */ },
     async get(id) { /* ... */ }
   }
   ```

4. **Create TanStack Query hooks**
   ```typescript
   // modules/[name]/queries/use[Name]Query.ts
   export function useOrdersQuery() {
     return useQuery({
       queryKey: ['orders'],
       queryFn: ordersApi.list
     })
   }
   ```

5. **Build components and pages**
   ```vue
   <!-- modules/[name]/pages/[Name]Page.vue -->
   <script setup lang="ts">
   const { data, isLoading } = useOrdersQuery()
   </script>
   ```

6. **Add routes**
   ```typescript
   // modules/[name]/routes.ts
   export const ordersRoutes = [/* ... */]
   ```

7. **Register routes**
   ```typescript
   // app/router/routes.ts
   import { ordersRoutes } from '@modules/orders/routes'
   ```

### Testing Strategy

#### Unit Tests (Vitest)
- Test composables
- Test utility functions
- Test store actions

#### Component Tests
- Test critical UI components
- Test user interactions
- Test conditional rendering

#### E2E Tests (Playwright/Cypress)
- Test main user flows
- Test authentication
- Test critical business processes

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Configuration
```env
VITE_API_BASE_URL=https://api.production.com
VITE_APP_TITLE=Nafi BackOffice
```

### Performance Checklist
- [ ] Enable gzip/brotli compression
- [ ] Configure CDN for static assets
- [ ] Set up monitoring (Sentry)
- [ ] Enable HTTP/2
- [ ] Configure CSP headers
- [ ] Set up SSL/TLS

## Common Patterns

### API Call with Loading State
```typescript
const { mutate, isPending, error } = useMutation({
  mutationFn: ordersApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['orders'] })
  }
})
```

### Permission-Based Rendering
```vue
<template>
  <button v-if="can('orders.delete')" @click="deleteOrder">
    Delete
  </button>
</template>

<script setup lang="ts">
const { can } = useCan()
</script>
```

### Form Handling with Validation
```vue
<script setup lang="ts">
const form = reactive({
  email: '',
  password: ''
})

const { login, isLoading, error } = useLogin()

function handleSubmit() {
  login(form)
}
</script>
```

## Troubleshooting

### Common Issues

1. **Module not found errors**
   - Check path aliases in `vite.config.ts` and `tsconfig.app.json`
   - Restart dev server after changing config

2. **Authentication loop**
   - Check `initialized` flag in `userStore`
   - Verify API `/auth/me` endpoint returns correct data

3. **Type errors**
   - Run `npm run type-check`
   - Ensure all imports have proper types

## Future Enhancements

- [ ] Add i18n for internationalization
- [ ] Implement dark mode
- [ ] Add real-time notifications (WebSockets)
- [ ] Set up Sentry for error tracking
- [ ] Add feature flags system
- [ ] Implement data export functionality
- [ ] Add comprehensive E2E tests

## Resources

- [Vue 3 Style Guide](https://vuejs.org/style-guide/)
- [Vue 3 Security Guide](https://vuejs.org/guide/best-practices/security.html)
- [Pinia Documentation](https://pinia.vuejs.org/)
- [TanStack Query](https://tanstack.com/query/latest)

---

**Maintained with ❤️ following enterprise best practices**
