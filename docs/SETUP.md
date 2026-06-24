# Netflix Clone - Full Stack

Uma aplicação Netflix clone com backend Node.js + MongoDB e frontend vanilla JavaScript.

## Arquitetura

```
├── backend/              # Node.js + Express API
│   └── src/
│       ├── models/         # Mongoose schemas
│       ├── routes/         # API endpoints
│       ├── controllers/    # Business logic
│       ├── middleware/     # JWT auth
│       └── seeds/          # Database seeding
├── frontend/
│   ├── pages/              # Static pages
│   ├── components/         # Reusable components
│   ├── services/           # API client/auth manager
│   ├── utils/              # Shared helpers
│   ├── shared/             # Shared CSS and scripts
│   └── assets/             # Images and icons
└── docker-compose.yml  # Container orchestration
```

## Stack

**Backend:**
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- bcryptjs password hashing

**Frontend:**
- Vanilla JavaScript (ES6 modules)
- Responsive CSS
- YouTube iframe embeds

**Infrastructure:**
- Docker + Docker Compose
- MongoDB container

## Quick Start

### Prerequisites
- Docker Desktop installed
- Port 5001 (backend) and 27017 (MongoDB) available

### Run the Project

```bash
# Start backend + MongoDB
docker-compose up -d

# Seed the database with 60 items
docker exec netflix-backend npm run seed

# Open browser
open http://localhost:5001
```

### Manual Setup (without Docker)

```bash
# Backend setup
cd backend
npm install
npm start

# In another terminal, seed database
npm run seed

# Frontend: open http://localhost:5001
```

## API Endpoints

### Auth
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login
- `POST /api/auth/verify` - Verify JWT token

### Content
- `GET /api/content` - All content (query: category, limit)
- `GET /api/content/:id` - Single content
- `GET /api/content/search?q=...` - Search

### User (requires auth)
- `POST /api/user/profile` - Create profile
- `GET /api/user/profile` - Get active profile
- `POST /api/user/watchhistory` - Save progress
- `GET /api/user/watchhistory` - Get watch history
- `PUT /api/user/watchhistory/:contentId` - Bookmark
- `GET /api/user/mylist` - Get bookmarks
- `GET /api/recommendations` - Get recommendations

## Environment Variables

**backend/.env:**
```
MONGODB_URI=mongodb://admin:admin123@mongodb:27017/netflix-clone?authSource=admin
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5001
```

## Features

✅ User authentication (register/login)
✅ Multiple profiles per account
✅ Content catalog (~60 items)
✅ Search functionality
✅ Watch history tracking
✅ "My List" bookmarks
✅ Personalized recommendations
✅ Dark/light theme toggle
✅ Responsive design

## Database Schema

**User:**
- email, password (hashed)
- username
- profiles: [{ name, avatar, isDefault }]
- activeProfileId

**Content:**
- title, category, image, youtubeUrl
- badge, description, duration, releaseYear
- tags

**WatchHistory:**
- userId, profileId, contentId
- progress (0-100%), isBookmarked
- lastWatchedAt

## Next Steps

1. Deploy backend to production (Heroku, Vercel, Railway)
2. Connect frontend to production API
3. Add real video streaming instead of YouTube embeds
4. Implement user ratings/reviews
5. Add social features (sharing, watchlists)
6. Mobile app version

## Troubleshooting

**MongoDB connection error:**
```bash
docker-compose ps
docker-compose logs mongodb
```

**Port already in use:**
```bash
# Change ports in docker-compose.yml
# Then restart containers
docker-compose down
docker-compose up -d
```

**Seed script failed:**
```bash
docker exec netflix-backend node src/seeds/seedContent.js
```

## License

MIT
