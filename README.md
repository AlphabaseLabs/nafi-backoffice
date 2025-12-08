# Nafi BackOffice

Enterprise-grade Vue 3 + TypeScript back-office application following best practices for security, performance, and maintainability.

## 🏗️ Architecture

This project follows a **modular, domain-driven architecture** inspired by enterprise-scale applications like Alibaba, Louis Vuitton, and Bitpanda Pro.

### Tech Stack

- **Framework**: Vue 3 with Composition API (`<script setup>`)
- **Build Tool**: Vite
- **Language**: TypeScript
- **State Management**:
  - Pinia (client state)
  - TanStack Query (server state)
- **Routing**: Vue Router 4 with authentication guards
- **HTTP Client**: Axios with interceptors
- **Linting**: ESLint + Prettier

## 📁 Project Structure

```
src/
├── app/                      # Application core
│   ├── App.vue              # Root component
│   ├── main.ts              # Application entry point
│   ├── router/              # Router configuration
│   ├── stores/              # Global Pinia stores
│   ├── config/              # Configuration
│   ├── plugins/             # Vue plugins
│   └── layouts/             # Layout components
│
├── modules/                 # Feature modules (vertical slices)
│   ├── auth/                # Authentication module
│   └── dashboard/           # Dashboard module
│
├── shared/                  # Shared resources
│   ├── ui/                  # Design system components
│   ├── components/          # Generic components
│   ├── composables/         # Reusable composables
│   ├── utils/               # Utility functions
│   └── types/               # TypeScript types
│
└── infrastructure/          # External integrations
    ├── http/                # HTTP client
    ├── auth/                # Auth token storage
    └── logging/             # Logging
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18
- npm, yarn, or pnpm

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run linter
npm run lint
```

## 🔐 Security Features

- Route Guards with RBAC
- HTTP Interceptors for auth
- XSS Prevention
- CSRF Protection ready
- Input validation

## ⚡ Performance

- Code Splitting
- TanStack Query caching
- Lazy-loaded routes
- Optimized bundle size

## 🎨 State Management

### Pinia (Client State)
- User auth & tokens
- UI state (sidebar, theme)
- Local app state

### TanStack Query (Server State)
- API data with caching
- Automatic refetching
- Pagination support

## 📝 Adding New Modules

```bash
mkdir -p src/modules/[name]/{api,store,components,pages}
touch src/modules/[name]/routes.ts
```

## 🔧 Environment Variables

Create `.env`:
```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_APP_TITLE=Nafi BackOffice
```

## 📚 Resources

- [Vue 3 Docs](https://vuejs.org/)
- [Pinia Docs](https://pinia.vuejs.org/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Vue Router](https://router.vuejs.org/)

## 📄 License

MIT
