# Legal Pets App

A comprehensive catalog of legal pets with detailed information about their background, history, diet, and ownership guides.

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, React Query
- **Backend**: NestJS, TypeScript, Prisma ORM, PostgreSQL
- **Auth**: JWT with refresh tokens
- **Storage**: AWS S3 (or Cloudinary) for media
- **Cache**: Redis (optional)

## Project Structure

```
pets/
├── backend/          # NestJS backend
│   ├── src/
│   │   ├── auth/     # Authentication module
│   │   ├── users/    # User management
│   │   ├── pets/     # Pet CRUD operations
│   │   ├── media/    # Media upload/management
│   │   ├── comments/ # Comments system
│   │   ├── tags/     # Tag management
│   │   ├── search/   # Search functionality
│   │   └── admin/    # Admin endpoints
│   └── prisma/       # Prisma schema
├── frontend/         # Next.js frontend
│   ├── app/          # App router pages
│   ├── components/   # React components
│   └── lib/          # Utilities and API client
└── prisma/           # Shared Prisma schema
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- yarn

### Backend Setup

1. Navigate to the backend directory:

```bash
cd backend
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env
# Edit .env with your database URL and other configs
```

4. Set up the database:

```bash
# Generate Prisma client
yarn prisma:generate

# Run migrations
yarn prisma:migrate
```

5. Start the development server:

```bash
yarn start:dev
```

The backend will run on `http://localhost:3001`

### Frontend Setup

1. Navigate to the frontend directory:

```bash
cd frontend
```

2. Install dependencies:

```bash
yarn install
```

3. Set up environment variables:

```bash
cp .env.example .env.local
# Edit .env.local with your API URL
```

4. Start the development server:

```bash
yarn dev
```

The frontend will run on `http://localhost:3000`

## API Endpoints

### Public Endpoints

- `GET /api/pets` - List pets (with pagination, search, filters)
- `GET /api/pets/:slug` - Get pet by slug
- `GET /api/tags` - List all tags
- `GET /api/search` - Search pets
- `GET /api/search/suggestions` - Get search suggestions

### Auth Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh` - Refresh access token
- `POST /api/auth/logout` - Logout

### User Endpoints (Protected)

- `GET /api/users/me` - Get current user profile
- `POST /api/users/me/bookmarks` - Add bookmark
- `DELETE /api/users/me/bookmarks/:petId` - Remove bookmark

### Admin Endpoints (Protected, Admin/Editor role)

- `POST /api/pets` - Create pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet
- `POST /api/media` - Upload media
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/audit` - Get audit logs

## Database Schema

The Prisma schema includes:

- **User** - User accounts with roles (USER, EDITOR, ADMIN)
- **Pet** - Pet information with rich content fields
- **Media** - Images and videos associated with pets
- **Tag** - Tags for categorizing pets
- **Comment** - User comments on pets
- **Bookmark** - User bookmarks
- **Token** - Refresh tokens for authentication
- **AuditLog** - Admin activity logs

## Features

- ✅ Public pet catalog with search and filtering
- ✅ User authentication and authorization
- ✅ Bookmarking system
- ✅ Comments system (with moderation)
- ✅ Admin panel for content management
- ✅ Media upload and management
- ✅ SEO-optimized pages with ISR
- ✅ Responsive design with Tailwind CSS

## Development

### Running Tests

Backend:

```bash
cd backend
yarn test
```

Frontend:

```bash
cd frontend
yarn test
```

### Database Migrations

```bash
cd backend
yarn prisma:migrate
```

### Prisma Studio

View and edit database data:

```bash
cd backend
yarn prisma:studio
```

## Deployment

### Quick Start

See **[QUICK_DEPLOY.md](./QUICK_DEPLOY.md)** for a step-by-step deployment guide (15 minutes).

### Detailed Guide

See **[DEPLOYMENT.md](./DEPLOYMENT.md)** for comprehensive deployment instructions.

### Recommended Setup (Free Tier)

- **Frontend**: [Vercel](https://vercel.com) - Free forever
- **Backend**: [Railway](https://railway.app) - $5 free credit/month
- **Database**: Railway PostgreSQL (included)

**Total Cost: $0/month**

### Quick Deploy Steps

1. **Frontend (Vercel)**:

   - Push code to GitHub
   - Import repo to Vercel
   - Set root directory to `frontend`
   - Deploy

2. **Backend (Railway)**:

   - Create Railway project from GitHub
   - Add PostgreSQL database
   - Deploy backend service (root: `backend`)
   - Set environment variables
   - Run migrations: `railway run yarn prisma migrate deploy`

3. **Connect**:
   - Set `NEXT_PUBLIC_API_URL` in Vercel to your Railway backend URL + `/api`

## License

MIT
