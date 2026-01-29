import { WatchPage } from '@/components/player/VideoPlayer'
import { notFound } from 'next/navigation'

// Validate ID parameters
function validateTVParams(id: string, season: string, episode: string): { id: number; season: number; episode: number } {
  const parsedId = parseInt(id, 10)
  const parsedSeason = parseInt(season, 10)
  const parsedEpisode = parseInt(episode, 10)

  if (!Number.isInteger(parsedId) || parsedId <= 0 || parsedId > 10000000) {
    notFound()
  }
  if (!Number.isInteger(parsedSeason) || parsedSeason <= 0) {
    notFound()
  }
  if (!Number.isInteger(parsedEpisode) || parsedEpisode <= 0) {
    notFound()
  }

  return { id: parsedId, season: parsedSeason, episode: parsedEpisode }
}

export default async function WatchTV({ 
  params 
}: { 
  params: Promise<{ id: string; season: string; episode: string }> 
}) {
  const resolvedParams = await params
  const { id, season, episode } = validateTVParams(
    resolvedParams.id,
    resolvedParams.season,
    resolvedParams.episode
  )

  return (
    <WatchPage 
      mediaType="tv" 
      tmdbId={id}
      season={season}
      episode={episode}
    />
  )
}
