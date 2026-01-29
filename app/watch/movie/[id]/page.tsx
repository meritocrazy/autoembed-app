import { WatchPage } from '@/components/player/VideoPlayer'
import { notFound } from 'next/navigation'

// Validate ID parameter
function validateMovieId(id: string): number {
  const parsed = parseInt(id, 10)
  if (!Number.isInteger(parsed) || parsed <= 0 || parsed > 10000000) {
    notFound()
  }
  return parsed
}

export default async function WatchMovie({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const movieId = validateMovieId(id)
  return <WatchPage mediaType="movie" tmdbId={movieId} />
}
