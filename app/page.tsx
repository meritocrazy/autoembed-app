import { MovieRow } from '@/components/movie/MovieRow'
import { TVRow } from '@/components/tv/TVRow'
import { tmdbAPI } from '@/lib/tmdb/client'
import { TMDBMovieResponse, TMDBTVResponse } from '@/types/tmdb'
import { Button } from '@/components/ui/button'
import { Play, Info, AlertCircle } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export const runtime = 'edge'

export default async function Home() {
  // Use Promise.allSettled to handle individual API failures
  const results = await Promise.allSettled([
    tmdbAPI.getTrendingMovies() as Promise<TMDBMovieResponse>,
    tmdbAPI.getTrendingTV() as Promise<TMDBTVResponse>,
    tmdbAPI.getPopularMovies() as Promise<TMDBMovieResponse>,
    tmdbAPI.getPopularTV() as Promise<TMDBTVResponse>,
  ])

  // Extract successful responses with fallbacks
  const trendingMovies: TMDBMovieResponse = results[0].status === 'fulfilled' 
    ? results[0].value 
    : { results: [], total_pages: 0, page: 1, total_results: 0 }
  
  const trendingTV: TMDBTVResponse = results[1].status === 'fulfilled' 
    ? results[1].value 
    : { results: [], total_pages: 0, page: 1, total_results: 0 }
  
  const popularMovies: TMDBMovieResponse = results[2].status === 'fulfilled' 
    ? results[2].value 
    : { results: [], total_pages: 0, page: 1, total_results: 0 }
  
  const popularTV: TMDBTVResponse = results[3].status === 'fulfilled' 
    ? results[3].value 
    : { results: [], total_pages: 0, page: 1, total_results: 0 }

  // Log any failed requests (for monitoring)
  const failedRequests = results.filter(r => r.status === 'rejected')
  if (failedRequests.length > 0) {
    console.error('Some TMDB API calls failed:', failedRequests)
  }

  const heroMovie = trendingMovies.results?.[0] || null
  const heroBackdrop = heroMovie?.backdrop_path 
    ? `https://image.tmdb.org/t/p/original${heroMovie.backdrop_path}`
    : null

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {heroMovie ? (
        <div className="relative h-[60vh] md:h-[70vh] flex items-center">
          {heroBackdrop && (
            <div className="absolute inset-0">
              <Image
                src={heroBackdrop}
                alt={heroMovie.title}
                fill
                className="object-cover"
                priority
                sizes="100vw"
              />
              <div className="absolute inset-0 hero-gradient" />
            </div>
          )}
          <div className="relative container mx-auto px-4 z-10 max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              {heroMovie.title}
            </h1>
            <p className="text-lg text-white/80 mb-6 line-clamp-3">
              {heroMovie.overview || 'No description available'}
            </p>
            <p className="text-sm text-white/60 mb-8">
              {heroMovie.release_date 
                ? new Date(heroMovie.release_date).getFullYear()
                : 'TBA'} • Rating: {heroMovie.vote_average?.toFixed(1) || 'N/A'}
            </p>
            <div className="flex gap-4">
              <Link href={`/watch/movie/${heroMovie.id}`}>
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5 fill-white" />
                  Play Now
                </Button>
              </Link>
              <Link href={`/movie/${heroMovie.id}`}>
                <Button size="lg" variant="secondary" className="gap-2">
                  <Info className="h-5 w-5" />
                  More Info
                </Button>
              </Link>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-[60vh] md:h-[70vh] flex items-center justify-center bg-muted/10">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-4 text-muted" />
            <p className="text-muted">Unable to load featured content</p>
          </div>
        </div>
      )}

      <div className="space-y-8 pb-16">
        {trendingMovies.results.length > 0 && (
          <MovieRow title="Trending Movies" movies={trendingMovies.results.slice(1)} />
        )}
        {trendingTV.results.length > 0 && (
          <TVRow title="Trending TV Shows" tvShows={trendingTV.results} />
        )}
        {popularMovies.results.length > 0 && (
          <MovieRow title="Popular Movies" movies={popularMovies.results} />
        )}
        {popularTV.results.length > 0 && (
          <TVRow title="Popular TV Shows" tvShows={popularTV.results} />
        )}
      </div>
    </div>
  )
}
