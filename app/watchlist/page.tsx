'use client'

import { useWatchlist } from '@/lib/hooks/useWatchlist'
import { useAuth } from '@/lib/hooks/useAuth'
import { MovieCard } from '@/components/movie/MovieCard'
import { TVCard } from '@/components/tv/TVCard'
import { Button } from '@/components/ui/button'
import { Heart, Trash2 } from 'lucide-react'
import Link from 'next/link'

export default function WatchlistPage() {
  const { user } = useAuth()
  const { watchlist, isLoading, removeFromWatchlist } = useWatchlist()

  if (!user) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted" />
          <h1 className="text-2xl font-bold mb-4">Sign in to view your watchlist</h1>
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
          <p className="text-muted">Loading watchlist...</p>
        </div>
      </div>
    )
  }

  if (watchlist.length === 0) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-muted" />
          <h1 className="text-2xl font-bold mb-4">Your watchlist is empty</h1>
          <p className="text-muted mb-8">Start adding movies and shows to your watchlist</p>
          <Link href="/">
            <Button>Browse Content</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">My Watchlist</h1>
        <p className="text-muted">{watchlist.length} {watchlist.length === 1 ? 'item' : 'items'}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {watchlist.map((item) => (
          <div key={item.id} className="relative group">
            {item.media_type === 'movie' ? (
              <Link href={`/movie/${item.tmdb_id}`}>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="aspect-[2/3] bg-black/20">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.tmdb_id}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            ) : (
              <Link href={`/tv/${item.tmdb_id}`}>
                <div className="bg-card border border-border rounded-lg overflow-hidden">
                  <div className="aspect-[2/3] bg-black/20">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${item.tmdb_id}`}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </Link>
            )}
            
            <button
              onClick={() => removeFromWatchlist(item.id)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
              title="Remove from watchlist"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
