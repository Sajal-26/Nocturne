# Nocturne

A Gen-Z Classical Social Entertainment Ecosystem.

Effortlessly blend high-fidelity music, anime discovery, and synchronized cinema into one AI-powered lounge.

---

## Vision

Nocturne is built for those who find their rhythm at night. It is more than a player; it is a social conductor that synchronizes your entertainment with your circle, powered by advanced AI systems.

---

## Core Features

### Watch Together
Real-time synchronized playback for movies and anime.

### Vibe Sync
Integrated music system powered by TIDAL metadata and YouTube recommendations.

### Muse AI
AI assistant powered by NVIDIA NIM for:
- Deep content recommendations  
- Semantic search  
- Mood-based discovery  

### Social Lounge
- Real-time chat  
- Profile customization  
- Friend activity tracking  

---

## Architecture Overview

Nocturne uses a hybrid monorepo architecture combining Python for AI and processing with Node.js for real-time systems.

```
nocturne/
├── frontend/             # React (JSX) + Tailwind UI
│   └── src/              # Feature-based organization (api/, components/, pages/)
├── backend-api/          # FastAPI (Python) - AI, scraping, core logic
│   └── app/              # Modular architecture (routers/, services/, models/)
└── backend-realtime/     # Node.js (Express) - WebSockets, Multer uploads
    └── src/              # Event-driven organization (sockets/, handlers/)
```

---

## Service Communication

### API Flow
```
Client → FastAPI → Supabase (PostgreSQL) → Client
```

### Real-Time Flow
```
Client → Node.js (Socket.io)
→ Redis (Pub/Sub signaling)
→ Broadcast to clients
```

### Content Fetching
```
FastAPI Scrapers (IMDb / AniList)
→ Supabase DB
→ Client
```

### File Upload Flow
```
Client → Node.js (Express + Multer)
→ Supabase Storage (Buckets)
```

---

## Tech Stack

| Layer            | Technology |
|------------------|-----------|
| Frontend         | React (JSX), Tailwind CSS, Axios |
| Core API         | FastAPI (Python), SQLAlchemy, AniList GraphQL |
| Realtime         | Node.js, Express, Socket.io, Multer |
| Database         | Supabase (PostgreSQL) |
| AI Engine        | NVIDIA NIM (Llama 3 / Mistral) |
| Storage          | Supabase Storage |
| Cache            | Upstash Redis |

---

## Content and Discovery

### Metadata Integration
IMDb and AniList provide rich metadata for movies and anime.

### Smart Scraper
Background workers fetch and cache streaming sources.

### Synced Player
- Resume playback support  
- Continue watching state  

---

## Music System

### TIDAL Integration
High-quality metadata for a premium music experience.

### YouTube Hybrid Engine
Automated recommendations based on listening behavior.

### Lounge Radio
Real-time collaborative music queues for shared listening.

---

## Social and Real-Time Features

### Watch Parties
- Synchronized playback (play, pause, seek)  
- Multi-user sessions  

### Messaging
- One-to-one chat  
- Group chat  
- Typing indicators  
- Online presence  

### User Profiles
- Custom avatars (via Multer uploads)  
- Bios and activity tracking  

---

## Muse AI

### Semantic Search
Search content using mood or descriptive queries instead of exact titles.

Example:
```
dark psychological anime with slow pacing
```

### AI Assistant
Context-aware chatbot for instant recommendations and discovery.

---

## Deployment Strategy

| Component        | Platform |
|-----------------|----------|
| Frontend        | Vercel |
| Backend APIs    | Fly.io (Dockerized) |
| Database        | Supabase Cloud |
| Cache           | Upstash Redis |

---

---

## Notes

- This is not a content hosting platform  
- Uses third-party embedded streaming sources  
- Focus is on system design, scalability, and real-time interaction  

---

## License

For educational and demonstration purposes only.

---

## Inspiration

Named after the musical composition, inspired by the night and the creator’s journey through Moonlight Sonata.

---

## Author

Built with a focus on real-time systems, AI integration, and scalable architecture.

---

## 🛠 Project Roadmap & Task Structure

### Phase 1: MVP Core & Authentication
Focus: Getting the base project connected to Supabase and listing content.

- [ ] **Infrastructure & Auth**
  - [ ] Set up Supabase Project & DB Schema (Users, Media)
  - [ ] Implement Auth in `backend-api` (Middleware)
  - [ ] Implement Auth in `frontend` (Login/Register/Protected Routes)
- [ ] **Media Discovery (Basic)**
  - [ ] `backend-api`: Basic IMDb/AniList scraper integrated
  - [ ] `backend-api`: Media search/list endpoints
  - [ ] `frontend`: Home Page (Grid of content)
- [ ] **Video Player (Local/Single)**
  - [ ] `frontend`: Video Player component (HLS/Dash support)
  - [ ] `frontend`: Player Controls (Custom skin)

### Phase 2: Social Foundation & Profiles
Focus: Building the social graph.

- [ ] **Profiles & Social**
  - [ ] `backend-api`: Profile CRUD + Avatar uploads
  - [ ] `backend-api`: Friend/Follow system logic
  - [ ] `frontend`: Profile Page implementation
- [ ] **Activity Tracking**
  - [ ] `backend-realtime`: Heartbeat system (Online/Offline status)
  - [ ] `frontend`: Friend activity Sidebar

### Phase 3: Realtime Engine & Chat
Focus: Enabling the "Synchronized Social" aspect.

- [ ] **WebSocket Infrastructure**
  - [ ] `backend-realtime`: Socket.io setup with Redis Adapter
  - [ ] `backend-realtime`: Chat service (Messages, Rooms)
  - [ ] `frontend`: Chat interface integration
- [ ] **Social Lounge**
  - [ ] `backend-api`: Room management (Create/Join)
  - [ ] `frontend`: Room Lobby UI

### Phase 4: Watch Parties & Synchronized Cinema
Focus: The core value proposition.

- [ ] **Synchronization Engine**
  - [ ] `backend-realtime`: Playback state sync (Seek, Pause, Play)
  - [ ] `backend-realtime`: Logic for "Host" vs "Viewer"
  - [ ] `frontend`: Synced player controls
- [ ] **Advanced Features**
  - [ ] `backend-api`: Continue watching/Playback history sync

### Phase 5: Muse AI & Vibe Sync
Focus: Premium AI-driven features.

- [ ] **NVIDIA NIM Integration**
  - [ ] `backend-api`: Semantic Search (Llama 3 / Mistral)
  - [ ] `backend-api`: AI Recommendation Engine
  - [ ] `frontend`: Muse AI Chat interface
- [ ] **Music (TIDAL/YouTube)**
  - [ ] `backend-api`: Music metadata integration
  - [ ] `frontend`: Vibe Sync player/controls
