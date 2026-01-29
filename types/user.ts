export interface UserProfile {
  id: string
  username: string
  avatar_url: string | null
  created_at: string
}

export interface WatchlistItem {
  id: string
  user_id: string
  tmdb_id: number
  media_type: 'movie' | 'tv'
  added_at: string
}

export interface WatchHistoryItem {
  id: string
  user_id: string
  tmdb_id: number
  media_type: 'movie' | 'tv'
  season_number: number | null
  episode_number: number | null
  watched_at: string
}

export interface DatabaseUser {
  id: string
  email: string
  created_at: string
}
