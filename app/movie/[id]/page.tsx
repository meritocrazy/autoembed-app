import { tmdbAPI } from '@/lib/tmdb/client'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { MovieCard } from '@/components/movie/MovieCard'
import { TMDBMovieDetails } from '@/types/tmdb'
import { Badge } from '@/components/ui/badge'
import { Play, Star, Calendar, Clock, Film, Heart } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getTMDBImage, formatRuntime, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

// Validate ID parameter
function validateMovieId(id: string): number {
  const parsed = parseInt(id, 10)
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 10000000) {
    throw new Error(`Invalid movie ID: ${id}`)
  }
  return parsed
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  try {
    const movieId = validateMovieId(id)
    const movie: TMDBMovieDetails = await tmdbAPI.getMovieDetails(movieId) as TMDBMovieDetails

    return {
      title: `${movie.title} - VidKing`,
      description: movie.overview,
    }
  } catch (error) {
    console.error('Failed to fetch movie metadata:', error)
    return {
      title: 'Movie - VidKing',
      description: 'Movie details',
    }
  }
}

export default async function MoviePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const movieId = validateMovieId(id)
    const movie: TMDBMovieDetails = await tmdbAPI.getMovieDetails(movieId) as TMDBMovieDetails

    if (!movie || !movie.id) {
      notFound()
    }

    const backdropUrl = getTMDBImage(movie.backdrop_path, 'original')
    const posterUrl = getTMDBImage(movie.poster_path, 'w780')

  return (
    <div className="min-h-[calc(100vh-64px)] pb-16">
      {backdropUrl && (
        <div className="relative h-[40vh] md:h-[50vh]">
          <Image
            src={backdropUrl}
            alt={movie.title}
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
          <div className="absolute inset-0 gradient-overlay" />
        </div>
      )}

      <div className="container mx-auto px-4 -mt-32 md:-mt-40 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <div className="relative aspect-[2/3] w-64 md:w-80 rounded-lg overflow-hidden shadow-2xl">
              <Image
                src={posterUrl}
                alt={movie.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{movie.title}</h1>
            {movie.tagline && (
              <p className="text-lg text-muted mb-6 italic">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{movie.vote_average?.toFixed(1)}</span>
              </div>
              {movie.release_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{formatDate(movie.release_date)}</span>
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  <span>{formatRuntime(movie.runtime)}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <p className="text-lg text-muted mb-8 leading-relaxed">
              {movie.overview || 'No overview available.'}
            </p>

            <div className="flex gap-4 mb-8">
              <Link href={`/watch/movie/${movie.id}`}>
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5 fill-white" />
                  Watch Now
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Heart className="h-5 w-5" />
                Add to Watchlist
              </Button>
            </div>

            {movie.credits?.cast && movie.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {movie.credits.cast.slice(0, 8).map((person) => (
                    <div key={person.id} className="flex flex-col items-center text-center">
                      {person.profile_path ? (
                        <div className="relative aspect-square w-20 md:w-24 rounded-full overflow-hidden mb-2">
                          <Image
                            src={getTMDBImage(person.profile_path)}
                            alt={person.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="aspect-square w-20 md:w-24 rounded-full bg-card flex items-center justify-center mb-2">
                          <Film className="h-8 w-8 text-muted" />
                        </div>
                      )}
                      <p className="text-sm font-medium">{person.name}</p>
                      <p className="text-xs text-muted">{person.character}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {movie.similar?.results && movie.similar.results.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Similar Movies</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {movie.similar.results.slice(0, 10).map((similarMovie) => (
                    <div key={similarMovie.id} className="flex-shrink-0 w-32 md:w-40">
                      <MovieCard movie={similarMovie} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
  } catch (error) {
    console.error('Failed to fetch movie details:', error)
    notFound()
  }
}
