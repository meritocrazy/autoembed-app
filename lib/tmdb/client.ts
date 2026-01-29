const TMDB_BASE_URL = 'https://api.themoviedb.org/3'
const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const FETCH_TIMEOUT_MS = 10000 // 10 second timeout

// Initialize API key - throw error if missing
if (!TMDB_API_KEY) {
  throw new Error('TMDB API key not configured. Set NEXT_PUBLIC_TMDB_API_KEY in your .env.local')
}

// Rate limiting: Queue requests to respect TMDB's 40 req/10 sec limit
const requestQueue: Array<{
  execute: () => Promise<any>
  resolve: (value: any) => void
  reject: (error: any) => void
}> = []

let isProcessing = false
const REQUEST_INTERVAL_MS = 250 // 4 requests per second to stay under limit

async function processRequestQueue() {
  if (isProcessing || requestQueue.length === 0) return

  isProcessing = true

  while (requestQueue.length > 0) {
    const request = requestQueue.shift()
    if (!request) break

    try {
      const result = await request.execute()
      request.resolve(result)
    } catch (error) {
      request.reject(error)
    }

    // Space out requests
    await new Promise(resolve => setTimeout(resolve, REQUEST_INTERVAL_MS))
  }

  isProcessing = false
}

function queueRequest<T>(execute: () => Promise<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    requestQueue.push({ execute, resolve, reject })
    processRequestQueue()
  })
}

// Helper to add timeout to fetch
async function fetchWithTimeout(url: string, options?: RequestInit): Promise<Response> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    })
    clearTimeout(timeout)
    return response
  } catch (error) {
    clearTimeout(timeout)
    if (error instanceof Error && error.name === 'AbortError') {
      throw new Error(`TMDB API request timeout after ${FETCH_TIMEOUT_MS}ms`)
    }
    throw error
  }
}

async function fetchTMDB<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
  return queueRequest(async () => {
    if (!TMDB_API_KEY) {
      throw new Error('TMDB API key not configured')
    }
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`)
    url.searchParams.append('api_key', TMDB_API_KEY)

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, value)
      })
    }

    const response = await fetchWithTimeout(url.toString(), {
      next: { revalidate: 3600 },
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`TMDB API error ${response.status}: ${response.statusText}. ${errorText}`)
    }

    const data = await response.json()
    return data as T
  })
}

export const tmdbAPI = {
  async getTrendingMovies(page: number = 1) {
    return fetchTMDB('/trending/movie/day', { page: page.toString() })
  },

  async getTrendingTV(page: number = 1) {
    return fetchTMDB('/trending/tv/day', { page: page.toString() })
  },

  async getPopularMovies(page: number = 1) {
    return fetchTMDB('/movie/popular', { page: page.toString() })
  },

  async getPopularTV(page: number = 1) {
    return fetchTMDB('/tv/popular', { page: page.toString() })
  },

  async getTopRatedMovies(page: number = 1) {
    return fetchTMDB('/movie/top_rated', { page: page.toString() })
  },

  async getTopRatedTV(page: number = 1) {
    return fetchTMDB('/tv/top_rated', { page: page.toString() })
  },

  async getMovieDetails(id: number) {
    return fetchTMDB(`/movie/${id}`, { append_to_response: 'credits,similar' })
  },

  async getTVDetails(id: number) {
    return fetchTMDB(`/tv/${id}`, { append_to_response: 'credits,similar' })
  },

  async getTVEpisodeDetails(id: number, season: number, episode: number) {
    return fetchTMDB(`/tv/${id}/season/${season}/episode/${episode}`)
  },

  async searchMulti(query: string, page: number = 1) {
    return fetchTMDB('/search/multi', { query, page: page.toString() })
  },

  async searchMovies(query: string, page: number = 1) {
    return fetchTMDB('/search/movie', { query, page: page.toString() })
  },

  async searchTV(query: string, page: number = 1) {
    return fetchTMDB('/search/tv', { query, page: page.toString() })
  },

  async discoverMovies(params?: {
    with_genres?: string
    year?: string
    'vote_average.gte'?: string
    sort_by?: string
    page?: string
  }) {
    return fetchTMDB('/discover/movie', params)
  },

  async discoverTV(params?: {
    with_genres?: string
    year?: string
    'vote_average.gte'?: string
    sort_by?: string
    page?: string
  }) {
    return fetchTMDB('/discover/tv', params)
  },
}
