# VidKing - Full-Stack Streaming Site

A Netflix-inspired streaming site built with Next.js 14, featuring movie and TV show streaming powered by TMDB API and AutoEmbed.

## Features

- 🎬 Browse trending and popular movies & TV shows
- 🔍 Search functionality with filters
- 📺 Integrated video player with multiple servers
- 👤 User authentication (Supabase)
- ❤️ Personal watchlist
- 📜 Watch history tracking
- 🎨 Netflix-inspired dark theme
- 📱 Fully responsive design
- ⚡ Fast loading with Next.js App Router

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Backend**: Supabase (PostgreSQL + Auth)
- **APIs**: 
  - TMDB API for movie/TV metadata
  - AutoEmbed.cc for video streaming
- **State Management**: SWR
- **TypeScript**: Full type safety

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### 1. Clone and Install

```bash
git clone <repository-url>
cd vidking-app
npm install
```

### 2. Get API Keys

#### TMDB API Key
1. Go to [themoviedb.org](https://www.themoviedb.org/)
2. Sign up and create an account
3. Go to Settings → API
4. Create a new API key
5. Copy your API key

#### Supabase Setup
1. Go to [supabase.com](https://supabase.com/)
2. Create a new project
3. Go to Project Settings → API
4. Copy your project URL and anon key

### 3. Set Up Supabase Database

Create the following tables in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  username TEXT UNIQUE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Watchlist table
CREATE TABLE watchlist (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
  added_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, tmdb_id, media_type)
);

-- Watch history table
CREATE TABLE watch_history (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) NOT NULL,
  tmdb_id INTEGER NOT NULL,
  media_type TEXT CHECK (media_type IN ('movie', 'tv')) NOT NULL,
  season_number INTEGER,
  episode_number INTEGER,
  watched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE watchlist ENABLE ROW LEVEL SECURITY;
ALTER TABLE watch_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own watchlist" 
  ON watchlist FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own history" 
  ON watch_history FOR ALL USING (auth.uid() = user_id);
```

### 4. Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your credentials:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# TMDB API
NEXT_PUBLIC_TMDB_API_KEY=your_tmdb_api_key

# Site
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
vidking-app/
├── app/                    # Next.js App Router pages
│   ├── auth-login/        # Login page
│   ├── auth-signup/       # Signup page
│   ├── search/            # Search page
│   ├── movie/[id]/        # Movie detail page
│   ├── tv/[id]/           # TV show detail page
│   ├── watch/             # Video player pages
│   ├── watchlist/         # Watchlist page
│   ├── history/           # Watch history page
│   ├── profile/           # User profile page
│   ├── layout.tsx         # Root layout
│   ├── globals.css        # Global styles
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   ├── layout/           # Layout components (Header, Footer)
│   ├── movie/            # Movie components (Card, Row)
│   ├── tv/               # TV components (Card, Row)
│   ├── player/           # Video player
│   ├── search/           # Search components
│   └── auth/             # Auth components (Forms)
├── lib/                   # Utilities and services
│   ├── supabase/         # Supabase client
│   ├── tmdb/             # TMDB API client
│   ├── hooks/            # Custom React hooks
│   └── utils.ts          # Utility functions
└── types/                 # TypeScript types
    ├── tmdb.ts           # TMDB API types
    └── user.ts           # User-related types
```

## Key Pages & Features

### Home Page (`/`)
- Hero banner with trending movie
- Horizontal scroll rows:
  - Trending Movies
  - Trending TV Shows
  - Popular Movies
  - Popular TV Shows

### Movie/TV Detail Pages
- High-quality poster and backdrop
- Cast information
- Similar recommendations
- Watch now button (links to player)

### Video Player (`/watch/movie/:id` or `/watch/tv/:id/:season/:episode`)
- Embedded player from AutoEmbed.cc
- 3 server options for better reliability
- Tracks watch history automatically

### Search (`/search`)
- Real-time search debouncing
- Filter by type (All/Movies/TV)
- Clean result display

### Watchlist (`/watchlist`)
- Personal collection of saved content
- Remove items with one click
- Redirects to detail pages

### History (`/history`)
- Recently watched items
- Resume playback options
- Clear all history button

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

The project is configured for automatic deployment to Vercel.

### Environment Variables for Production

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
NEXT_PUBLIC_TMDB_API_KEY=
NEXT_PUBLIC_SITE_URL=https://your-domain.com
```

## API Credits

- **[TMDB](https://www.themoviedb.org/)** - Provides movie and TV show data
- **[AutoEmbed](https://autoembed.cc)** - Provides video streaming embeds

## License

This project is for educational purposes only. Please respect the terms of service of the APIs used.

## Troubleshooting

### Images not loading
- Check that TMDB API key is correct
- Verify internet connectivity

### Video player not working
- Try different servers (1, 2, or 3)
- Check AutoEmbed service status

### Authentication issues
- Verify Supabase credentials
- Check Supabase project is not paused
- Ensure RLS policies are set up correctly

## Contributing

Feel free to submit issues, fork the repository, and create pull requests.

## Support

For issues related to:
- **TMDB API**: https://www.themoviedb.org/documentation/api
- **Supabase**: https://supabase.com/docs
- **AutoEmbed**: https://autoembed.cc
