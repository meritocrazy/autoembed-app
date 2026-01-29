'use client'

import { useWatchHistory } from '@/lib/hooks/useHistory'
import { useAuth } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'
import { Clock, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default function HistoryPage() {
  const { user } = useAuth()
  const { history, isLoading, clearHistory } = useWatchHistory()

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center">
          <Clock className="h-16 w-16 mx-auto mb-4 text-muted" />
          <h1 className="text-2xl font-bold mb-4">Sign in to view your history</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent mx-auto mb-4" />
          <p className="text-muted">Loading history...</p>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center">
          <Clock className="h-16 w-16 mx-auto mb-4 text-muted" />
          <h1 className="text-2xl font-bold mb-4">No watch history yet</h1>
          <p className="text-muted mb-8">Start watching movies and shows to build your history</p>
          <Link href="/">
            <Button>Browse Content</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Watch History</h1>
          <p className="text-muted">{history.length} {history.length === 1 ? 'item' : 'items'}</p>
        </div>
        <Button variant="outline" onClick={clearHistory} className="gap-2">
          <Trash2 className="h-4 w-4" />
          Clear History
        </Button>
      </div>

      <div className="space-y-4">
        {history.map((item) => (
          <div key={item.id} className="bg-card border border-border rounded-lg p-4 flex gap-4">
            <div className="flex-shrink-0">
              <img
                src={`https://image.tmdb.org/t/p/w200${item.tmdb_id}`}
                alt=""
                className="w-24 h-36 object-cover rounded"
              />
            </div>
            <div className="flex-1 min-w-0">
              <Link
                href={
                  item.media_type === 'movie'
                    ? `/movie/${item.tmdb_id}`
                    : item.season_number
                    ? `/watch/tv/${item.tmdb_id}/${item.season_number}/${item.episode_number}`
                    : `/tv/${item.tmdb_id}`
                }
                className="block hover:text-accent transition-colors"
              >
                <h3 className="font-semibold text-lg mb-1">
                  {item.media_type === 'movie' ? `Movie #${item.tmdb_id}` : `TV Show #${item.tmdb_id}`}
                </h3>
              </Link>
              {item.season_number && item.episode_number && (
                <p className="text-sm text-muted mb-2">
                  Season {item.season_number}, Episode {item.episode_number}
                </p>
              )}
              <p className="text-sm text-muted">
                Watched {formatDate(item.watched_at)}
              </p>
            </div>
            <div className="flex-shrink-0">
              <Link
                href={
                  item.media_type === 'movie'
                    ? `/watch/movie/${item.tmdb_id}`
                    : item.season_number && item.episode_number
                    ? `/watch/tv/${item.tmdb_id}/${item.season_number}/${item.episode_number}`
                    : `/tv/${item.tmdb_id}/1/1`
                }
              >
                <Button variant="outline" size="sm">Watch Again</Button>
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
