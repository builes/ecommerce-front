# E-Commerce Admin Panel

Frontend admin panel for the Spring Boot e-commerce API. Built with React 19, Vite 8, Tailwind CSS 4, and Base UI.

## Routes

| Path | Page | Access |
|------|------|--------|
| `/` | Dashboard | Authenticated |
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/products` | Product list | Authenticated |
| `/products/new` | Create product | Admin |
| `/products/:id/edit` | Edit product | Admin |
| `/orders` | Order list | Authenticated |
| `/orders/new` | Create order | Authenticated |
| `/orders/:id` | Order detail | Authenticated |
| `/users` | User list | Admin |
| `/users/new` | Create user | Admin |
| `/users/:id/edit` | Edit user | Admin |
| `/roles` | Role list | Admin |
| `/roles/new` | Create role | Admin |
| `/roles/:id/edit` | Edit role | Admin |

## Quick Start

```bash
pnpm install
pnpm dev
```

Create a `.env` file:

```env
VITE_API_URL=http://localhost:8080
```

Default users: `admin` / `admin123` (ADMIN) and `user` / `user123` (USER).

## Deployment

The app is deployed on an **Ubuntu server** with automated CI/CD via **GitHub Actions**. The pipeline runs on a **self-hosted runner**:

1. **Push to `main`** triggers the workflow
2. **Install & Lint** — `pnpm install --frozen-lockfile` + `pnpm lint`
3. **Build** — `pnpm build` generates the `dist/` folder
4. **Upload** — built files are uploaded to the server
5. **Reload** — nginx is reloaded to serve the new version
