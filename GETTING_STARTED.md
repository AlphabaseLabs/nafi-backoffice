# Getting Started with Nafi BackOffice

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
Create a `.env` file:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Nafi BackOffice
```

### 3. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the app.

### 4. Login
The login page will appear at `/auth/login`.

**Note**: You need a backend API running at the configured URL. The app expects these endpoints:
- `POST /auth/login` - Login
- `GET /auth/me` - Get current user
- `POST /auth/logout` - Logout

## Development Workflow

### Running the App
```bash
# Development server with hot reload
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run type-check

# Linting
npm run lint

# Format code
npm run format
```

### Project Structure Quick Reference

```
src/
├── app/              # Core application (router, stores, config)
├── modules/          # Feature modules (auth, dashboard)
├── shared/           # Reusable components, composables, types
└── infrastructure/   # HTTP client, logging, external integrations
```

## Creating Your First Module

### Example: Creating a "Users" Module

#### 1. Create Folder Structure
```bash
mkdir -p src/modules/users/{api,store,components,pages}
```

#### 2. Create API Layer
```typescript
// src/modules/users/api/users.api.ts
import { httpClient } from '@infra/http/client'

export interface User {
  id: string
  name: string
  email: string
}

export const usersApi = {
  async list() {
    const { data } = await httpClient.get<User[]>('/users')
    return data
  },

  async get(id: string) {
    const { data } = await httpClient.get<User>(`/users/${id}`)
    return data
  },

  async create(user: Partial<User>) {
    const { data } = await httpClient.post<User>('/users', user)
    return data
  }
}
```

#### 3. Create TanStack Query Hook
```typescript
// src/modules/users/queries/useUsersQuery.ts
import { useQuery } from '@tanstack/vue-query'
import { usersApi } from '../api/users.api'

export function useUsersQuery() {
  return useQuery({
    queryKey: ['users'],
    queryFn: usersApi.list
  })
}
```

#### 4. Create Page Component
```vue
<!-- src/modules/users/pages/UsersListPage.vue -->
<template>
  <div class="users-page">
    <h1>Users</h1>

    <div v-if="isLoading">Loading...</div>
    <div v-else-if="error">Error: {{ error.message }}</div>

    <ul v-else>
      <li v-for="user in data" :key="user.id">
        {{ user.name }} - {{ user.email }}
      </li>
    </ul>
  </div>
</template>

<script setup lang="ts">
import { useUsersQuery } from '../queries/useUsersQuery'

const { data, isLoading, error } = useUsersQuery()
</script>

<style scoped>
.users-page {
  padding: 2rem;
}
</style>
```

#### 5. Create Routes
```typescript
// src/modules/users/routes.ts
import type { RouteRecordRaw } from 'vue-router'

export const usersRoutes: RouteRecordRaw[] = [
  {
    path: 'users',
    name: 'users.list',
    component: () => import('./pages/UsersListPage.vue'),
    meta: {
      requiresAuth: true,
      permissions: ['users.view'],
      title: 'Users'
    }
  }
]
```

#### 6. Register Routes
```typescript
// src/app/router/routes.ts
import { usersRoutes } from '@modules/users/routes'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@app/layouts/AppShell.vue'),
    meta: { requiresAuth: true },
    children: [
      ...dashboardRoutes,
      ...usersRoutes, // Add this line
    ],
  },
  // ...
]
```

#### 7. Add Navigation Link
```vue
<!-- src/app/layouts/AppShell.vue -->
<nav class="sidebar-nav">
  <router-link to="/" class="nav-item">
    <span class="nav-icon">🏠</span>
    <span v-if="sidebarOpen" class="nav-text">Dashboard</span>
  </router-link>

  <!-- Add this -->
  <router-link to="/users" class="nav-item">
    <span class="nav-icon">👥</span>
    <span v-if="sidebarOpen" class="nav-text">Users</span>
  </router-link>

  <!-- ... -->
</nav>
```

## Working with State Management

### Using Pinia for Local State
```typescript
// src/modules/users/store/users.ui.store.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersUiStore = defineStore('users-ui', () => {
  const searchTerm = ref('')
  const selectedRole = ref<string | null>(null)

  function clearFilters() {
    searchTerm.value = ''
    selectedRole.value = null
  }

  return {
    searchTerm,
    selectedRole,
    clearFilters
  }
})
```

### Using TanStack Query for Server Data
```typescript
// Fetching data
const { data, isLoading, error } = useQuery({
  queryKey: ['users'],
  queryFn: usersApi.list
})

// Mutations
const { mutate, isPending } = useMutation({
  mutationFn: usersApi.create,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['users'] })
  }
})
```

## Authentication & Permissions

### Checking Authentication in Components
```vue
<script setup lang="ts">
import { useUserStore } from '@app/stores/user.store'

const userStore = useUserStore()
</script>

<template>
  <div v-if="userStore.isAuthenticated">
    Welcome, {{ userStore.user?.name }}
  </div>
</template>
```

### Checking Permissions
```vue
<script setup lang="ts">
import { useCan } from '@shared/composables/useCan'

const { can, canAny, canAll } = useCan()
</script>

<template>
  <button v-if="can('users.delete')" @click="deleteUser">
    Delete
  </button>

  <div v-if="canAny(['users.view', 'users.create'])">
    User management section
  </div>
</template>
```

### Protected Routes
```typescript
{
  path: 'admin',
  name: 'admin.dashboard',
  component: AdminDashboard,
  meta: {
    requiresAuth: true,
    permissions: ['admin.access'] // Only users with this permission can access
  }
}
```

## Common Tasks

### Adding a New Permission
```typescript
// src/app/config/permissions.ts
export const PERMISSIONS = {
  // ... existing permissions
  USERS_EXPORT: 'users.export', // Add new permission
}
```

### Creating a Composable
```typescript
// src/shared/composables/useDebounce.ts
import { ref, watch } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number = 300) {
  const debouncedValue = ref(value.value) as Ref<T>

  watch(value, (newValue) => {
    const timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)

    return () => clearTimeout(timeout)
  })

  return debouncedValue
}
```

### Adding Environment Variables
```env
# .env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_FEATURE_NEW_UI=true
```

```typescript
// src/app/config/env.ts
export const config = {
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
  featureNewUi: import.meta.env.VITE_FEATURE_NEW_UI === 'true'
}
```

## Debugging Tips

### Vue Devtools
Install the Vue Devtools browser extension to inspect:
- Component hierarchy
- Pinia stores
- Router state
- TanStack Query cache

### Console Logging
```typescript
// Development only logging
if (import.meta.env.DEV) {
  console.log('User data:', userData)
}
```

### Type Checking
```bash
# Check for TypeScript errors
npm run type-check
```

## Next Steps

1. **Read the Architecture Guide**: See `ARCHITECTURE.md` for detailed architecture documentation
2. **Explore Existing Modules**: Look at `modules/auth` and `modules/dashboard` for examples
3. **Set up Backend API**: The app expects a REST API with the endpoints documented above
4. **Customize Styling**: Modify component styles or add a UI library like Tailwind CSS
5. **Add Tests**: Write unit and E2E tests for your modules

## Need Help?

- Check `ARCHITECTURE.md` for detailed documentation
- Review existing module code for patterns
- Refer to the Vue 3 documentation: https://vuejs.org/
- Check TanStack Query docs: https://tanstack.com/query/latest

Happy coding! 🚀
