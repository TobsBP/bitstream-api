# Bitstream API

REST API for a social platform. Built with Fastify, TypeScript, PostgreSQL and Supabase.

## Stack

- **Runtime:** Node.js + TypeScript
- **Framework:** Fastify 5
- **Database:** PostgreSQL via `postgres` driver
- **Storage:** Supabase (auth/storage) + Cloudinary (image uploads)
- **Validation:** Zod + fastify-type-provider-zod
- **Auth:** JWT (`@fastify/jwt`)
- **Docs:** Scalar (`/docs`)
- **Monitoring:** Sentry
- **Linter:** Biome

## Getting started

```bash
npm install
```

Create a `.env` file:

```env
DATABASE_URL=
JWT_SECRET=
SUPABASE_URL=
SUPABASE_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
SENTRY_DSN=
```

```bash
# Development
npm run dev

# Production
npm run build
npm start
```

Server runs on `http://localhost:3333`.  
API docs available at `http://localhost:3333/docs`.

## Routes

### Auth
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | — | Register a new user |
| POST | `/auth/login` | — | Login and receive JWT |

### Users
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/user/:id` | — | Get user by ID |
| PATCH | `/user/:id` | JWT | Update user profile |
| POST | `/user/:id/avatar` | JWT | Upload avatar |
| GET | `/user/:id/achievements` | — | Get user achievements |
| GET | `/user/:id/posts` | — | Get user posts |

### Followers
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/user/:id/followers` | — | List followers |
| GET | `/user/:id/following` | — | List following |
| POST | `/user/:id/follow` | JWT | Toggle follow/unfollow |

### Posts
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/posts` | — | List all posts |
| GET | `/post/:id` | — | Get post by ID |
| GET | `/posts/:userId` | — | Get posts by user |
| POST | `/post` | JWT | Create post (`multipart/form-data`) |
| PATCH | `/post/:id` | JWT | Update post |
| DELETE | `/post/:id` | JWT | Delete post |

### Collections
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/collections` | — | List all collections |
| GET | `/collection/:id` | — | Get collection by ID |
| POST | `/collection` | JWT | Create collection |
| POST | `/collection/:id/post` | JWT | Add post to collection |

### Hashtags
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/trending` | — | Trending hashtags |
| GET | `/hashtag/:tag/posts` | — | Posts by hashtag |
| GET | `/discover` | — | Discover posts |

### Duels
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/duels` | — | List all duels |
| GET | `/duel/:id` | — | Get duel by ID |
| POST | `/duel` | JWT | Create duel |
| POST | `/duel/:id/vote` | JWT | Vote on a duel |

## Project structure

```
src/
├── controllers/   # Request/response handling
├── services/      # Business logic
├── repositories/  # Database queries
├── routes/        # Route definitions and schemas
├── middleware/    # Auth middleware
├── types/         # Zod schemas and TypeScript types
├── lib/           # Cloudinary, Supabase, Sentry clients
├── router.ts      # Route registration
└── server.ts      # App bootstrap
```
