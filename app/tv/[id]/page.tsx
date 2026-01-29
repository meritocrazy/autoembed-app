import { tmdbAPI } from '@/lib/tmdb/client'
import type { Metadata } from 'next'
import { Button } from '@/components/ui/button'
import { TVCard } from '@/components/tv/TVCard'
import { TMDBTVDetails } from '@/types/tmdb'
import { Badge } from '@/components/ui/badge'
import { Play, Star, Calendar, Clock, Film, Heart, TrendingUp } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { getTMDBImage, formatDate } from '@/lib/utils'
import { notFound } from 'next/navigation'

// Validate ID parameter
function validateTVId(id: string): number {
  const parsed = parseInt(id, 10)
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 10000000) {
    throw new Error(`Invalid TV show ID: ${id}`)
  }
  return parsed
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params
  
  try {
    const tvId = validateTVId(id)
    const tv: TMDBTVDetails = await tmdbAPI.getTVDetails(tvId) as TMDBTVDetails

    return {
      title: `${tv.name} - VidKing`,
      description: tv.overview,
    }
  } catch (error) {
    console.error('Failed to fetch TV metadata:', error)
    return {
      title: 'TV Show - VidKing',
      description: 'TV show details',
    }
  }
}

export default async function TVPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  
  try {
    const tvId = validateTVId(id)
    const tv: TMDBTVDetails = await tmdbAPI.getTVDetails(tvId) as TMDBTVDetails

    if (!tv || !tv.id) {
      notFound()
    }

    const backdropUrl = getTMDBImage(tv.backdrop_path, 'original')
    const posterUrl = getTMDBImage(tv.poster_path, 'w780')
    const totalEpisodes = tv.seasons?.reduce((sum, season) => sum + season.episode_count, 0) || 0

    return (
      <div className="min-h-[calc(100vh-64px)] pb-16">
        {backdropUrl && (
          <div className="relative h-[40vh] md:h-[50vh]">
            <Image
              src={backdropUrl}
              alt={tv.name}
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
                alt={tv.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 256px, 320px"
              />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">{tv.name}</h1>
            {tv.tagline && (
              <p className="text-lg text-muted mb-6 italic">{tv.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-semibold">{tv.vote_average?.toFixed(1)}</span>
              </div>
              {tv.first_air_date && (
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  <span>{dateFns(new Date(tv.first_air_date))}</span>
                </div>
              )}
              {tv.number_of_seasons && (
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>{tv.number_of_seasons} Season{tv.number_of_seasons !== 1 ? 's' : ''}</span>
                </div>
              )}
              {totalEpisodes > 0 && (
                <div className="flex items-center gap-2">
                  <Film className="h-5 w-5" />
                  <span>{totalEpisodes} Episode{totalEpisodes !== 1 ? 's' : ''}</span>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {tv.genres?.map((genre) => (
                <Badge key={genre.id} variant="secondary">
                  {genre.name}
                </Badge>
              ))}
            </div>

            <p className="text-lg text-muted mb-8 leading-relaxed">
              {tv.overview || 'No overview available.'}
            </p>

            <div className="flex gap-4 mb-8">
              <Link href={`/watch/tv/${tv.id}/1/1`}>
                <Button size="lg" className="gap-2">
                  <Play className="h-5 w-5 fill-white" />
                  Play Episode 1
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="gap-2">
                <Heart className="h-5 w-5" />
                Add to Watchlist
              </Button>
            </div>

            {tv.seasons && tv.seasons.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Seasons</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tv.seasons.map((season) => (
                    season.season_number > 0 && (
                      <Link
                        key={season.id}
                        href={`/watch/tv/${tv.id}/${season.season_number}/1`}
                        className="block"
                      >
                        <div className="bg-card border border-border rounded-lg overflow-hidden hover:border-accent transition-colors">
                          <div className="relative aspect-video">
                            {season.poster_path ? (
                              <Image
                                src={getTMDBImage(season.poster_path)}
                                alt={season.name}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="w-full h-full bg-card flex items-center justify-center">
                                <Film className="h-8 w-8 text-muted" />
                              </div>
                            )}
                          </div>
                          <div className="p-3">
                            <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                              {season.name}
                            </h3>
                            <p className="text-xs text-muted">
                              {season.episode_count} Episodes
                            </p>
                          </div>
                        </div>
                      </Link>
                    )
                  ))}
                </div>
              </div>
            )}

            {tv.credits?.cast && tv.credits.cast.length > 0 && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Cast</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tv.credits.cast.slice(0, 8).map((person) => (
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

            {tv.similar?.results && tv.similar.results.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4">Similar Shows</h2>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {tv.similar.results.slice(0, 10).map((similarTV) => (
                    <div key={similarTV.id} className="flex-shrink-0 w-32 md:w-40">
                      <TVCard tv={similarTV} />
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
    console.error('Failed to fetch TV details:', error)
    notFound()
  }
}
