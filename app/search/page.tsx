'use client'

import { useState } from 'react'
import { tmdbAPI } from '@/lib/tmdb/client'
import { TMDBMovieResponse, TMDBTVResponse, TMDBMultiResponse, TMDBMovie, TMDBV } from '@/types/tmdb'
import { MovieCard } from '@/components/movie/MovieCard'
import { TVCard } from '@/components/tv/TVCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search as SearchIcon, Loader2, AlertCircle } from 'lucide-react'
import { debounce } from '@/lib/utils'

const SEARCH_MIN_LENGTH = 2
const SEARCH_MAX_LENGTH = 200
const SEARCH_PATTERN = /^[a-zA-Z0-9\s\-&':]*$/

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<(TMDBMovie | TMDBtv)[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [mediaType, setMediaType] = useState<'all' | 'movie' | 'tv'>('all')

  // Validate search input
  function validateSearchInput(input: string): { valid: boolean; error?: string } {
    const trimmed = input.trim()

    if (!trimmed) {
      return { valid: true } // Empty is OK, just don't search
    }

    if (trimmed.length < SEARCH_MIN_LENGTH) {
      return { valid: false, error: `Search query must be at least ${SEARCH_MIN_LENGTH} characters` }
    }

    if (trimmed.length > SEARCH_MAX_LENGTH) {
      return { valid: false, error: `Search query must not exceed ${SEARCH_MAX_LENGTH} characters` }
    }

    if (!SEARCH_PATTERN.test(trimmed)) {
      return { valid: false, error: 'Search query contains invalid characters' }
    }

    return { valid: true }
  }

  const search = debounce(async (searchQuery: string) => {
    const validation = validateSearchInput(searchQuery)

    if (!validation.valid) {
      setError(validation.error || null)
      setResults([])
      setLoading(false)
      return
    }

    if (!searchQuery.trim()) {
      setResults([])
      setError(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    try {
      let data: TMDBMovieResponse | TMDBTVResponse | TMDBMultiResponse
      if (mediaType === 'movie') {
        data = await tmdbAPI.searchMovies(searchQuery.trim()) as TMDBMovieResponse
      } else if (mediaType === 'tv') {
        data = await tmdbAPI.searchTV(searchQuery.trim()) as TMDBTVResponse
      } else {
        data = await tmdbAPI.searchMulti(searchQuery.trim()) as TMDBMultiResponse
      }

      const filteredResults = (data.results || []).filter(
        (item): item is (TMDBMovie | TMDBV) => item.media_type === 'movie' || item.media_type === 'tv'
      )

      setResults(filteredResults)
    } catch (error) {
      console.error('Search error:', error)
      setError(error instanceof Error ? error.message : 'Search failed. Please try again.')
      setResults([])
    } finally {
      setLoading(false)
    }
  }, 500)

  function handleSearchInput(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setQuery(value)
    search(value)
  }

  function isMovie(item: any): item is TMDBMovie {
    return item.media_type === 'movie'
  }

  function isTV(item: any): item is TMDBV {
    return item.media_type === 'tv'
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-6">Search</h1>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="relative flex-1">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted" />
              <Input
                type="text"
                placeholder="Search for movies and TV shows..."
                value={query}
                onChange={handleSearchInput}
                className="pl-10 h-12"
                maxLength={SEARCH_MAX_LENGTH}
              />
            </div>
            <Button
              variant={mediaType === 'all' ? 'default' : 'outline'}
              onClick={() => setMediaType('all')}
            >
              All
            </Button>
            <Button
              variant={mediaType === 'movie' ? 'default' : 'outline'}
              onClick={() => setMediaType('movie')}
            >
              Movies
            </Button>
            <Button
              variant={mediaType === 'tv' ? 'default' : 'outline'}
              onClick={() => setMediaType('tv')}
            >
              TV Shows
            </Button>
          </div>
        </div>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 mb-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted">No results found for &quot;{query}&quot;</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-muted mb-6">
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => (
              <div key={`${item.media_type}-${item.id}`}>
                {isMovie(item) ? (
                  <MovieCard movie={item} />
                ) : isTV(item) ? (
                  <TVCard tv={item} />
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      {!query && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted" />
          <h2 className="text-xl font-semibold mb-2">Start searching</h2>
          <p className="text-muted">
            Enter a movie or TV show title in the search box above
          </p>
        </div>
      )}
    </div>
  )
}
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted" />
        </div>
      )}

      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 mb-6">
          <AlertCircle className="h-5 w-5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {!loading && query && results.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted">No results found for &quot;{query}&quot;</p>
        </div>
      )}

      {!loading && results.length > 0 && (
        <>
          <p className="text-muted mb-6">
            {results.length} result{results.length !== 1 ? 's' : ''} for &quot;{query}&quot;
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {results.map((item) => (
              <div key={`${item.media_type}-${item.id}`}>
                {isMovie(item) ? (
                  <MovieCard movie={item} />
                ) : isTV(item) ? (
                  <TVCard tv={item} />
                ) : null}
              </div>
            ))}
          </div>
        </>
      )}

      {!query && (
        <div className="text-center py-12">
          <SearchIcon className="h-16 w-16 mx-auto mb-4 text-muted" />
          <h2 className="text-xl font-semibold mb-2">Start searching</h2>
          <p className="text-muted">
            Enter a movie or TV show title in the search box above
          </p>
        </div>
      )}
    </div>
  )
}
