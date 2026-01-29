export interface TMDBMovie {
  id: number
  title: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  release_date: string
  genre_ids: number[]
  adult: boolean
  original_language: string
  original_title: string
  popularity: number
  video: boolean
}

export interface TMDBTVShow {
  id: number
  name: string
  poster_path: string | null
  backdrop_path: string | null
  overview: string
  vote_average: number
  first_air_date: string
  genre_ids: number[]
  origin_country: string[]
  original_language: string
  original_name: string
  popularity: number
}

export interface TMDBMovieDetails extends TMDBMovie {
  genres: TMDBGenre[]
  runtime: number
  status: string
  tagline: string
  budget: number
  revenue: number
  credits?: TMDBCredits
  similar?: TMDBMovieResponse
}

export interface TMDBTVDetails extends TMDBTVShow {
  genres: TMDBGenre[]
  number_of_seasons: number
  number_of_episodes: number
  seasons: TMDBSeason[]
  status: string
  tagline: string
  credits?: TMDBCredits
  similar?: TMDBTVResponse
}

export interface TMDBGenre {
  id: number
  name: string
}

export interface TMDBObject {
  id: number
  media_type: 'movie' | 'tv'
}

export interface TMDBMovieResponse {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBTVResponse {
  page: number
  results: TMDBTVShow[]
  total_pages: number
  total_results: number
}

export interface TMDBMultiResponse {
  page: number
  results: (TMDBMovie | TMDBTVShow | TMDBObject)[]
  total_pages: number
  total_results: number
}

export interface TMDBCredits {
  cast: TMDBCast[]
  crew: TMDBCrew[]
}

export interface TMDBCast {
  id: number
  name: string
  character: string
  profile_path: string | null
  order: number
}

export interface TMDBCrew {
  id: number
  name: string
  job: string
  profile_path: string | null
}

export interface TMDBSeason {
  id: number
  season_number: number
  episode_count: number
  name: string
  overview: string
  poster_path: string | null
  air_date: string
}

export interface TMDBEpisodeDetails {
  id: number
  name: string
  overview: string
  still_path: string | null
  episode_number: number
  season_number: number
  vote_average: number
  air_date: string
  runtime: number
}

export type MediaType = 'movie' | 'tv'
// Alias for TV type (used in search results where it's called TMDBV)
export type TMDBV = TMDBTVShow
