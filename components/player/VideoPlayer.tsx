'use client'

import { useState } from 'react'
import { useWatchHistory } from '@/lib/hooks/useHistory'
import { useAuth } from '@/lib/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { getEmbedURL } from '@/lib/utils'
import { AlertCircle } from 'lucide-react'

interface WatchPageProps {
  mediaType: 'movie' | 'tv'
  tmdbId: number
  season?: number
  episode?: number
}

export function WatchPage({ mediaType, tmdbId, season, episode }: WatchPageProps) {
  const [server, setServer] = useState<1 | 2 | 3>(1)
  const [embedError, setEmbedError] = useState<string | null>(null)
  const { user } = useAuth()
  const { addToHistory } = useWatchHistory()
  const router = useRouter()

  useEffect(() => {
    async function trackView() {
      if (user) {
        try {
          await addToHistory({
            tmdbId,
            mediaType,
            seasonNumber: season,
            episodeNumber: episode,
          })
        } catch (error) {
          console.error('Failed to add to history:', error)
          // Don't show error to user for history tracking failures
        }
      }
    }

    trackView()
  }, [user, tmdbId, mediaType, season, episode, addToHistory])

  let embedUrl: string | null = null
  try {
    embedUrl = getEmbedURL(mediaType, tmdbId, season, episode, server)
    setEmbedError(null)
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to load video'
    setEmbedError(message)
  }

  return (
    <div className="min-h-[calc(100vh-64px)] bg-black">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold">
            Watching {mediaType === 'movie' ? 'Movie' : 'TV Show'} #{tmdbId}
            {season !== undefined && ` - Season ${season}`}
            {episode !== undefined && ` - Episode ${episode}`}
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.back()}
              className="px-4 py-2 bg-zinc-800 rounded-lg hover:bg-zinc-700 transition-colors"
            >
              Back
            </button>
          </div>
        </div>

        {embedError ? (
          <div className="max-w-6xl mx-auto bg-red-500/10 border border-red-500/20 rounded-lg p-6 flex items-center gap-4">
            <AlertCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
            <div>
              <p className="text-red-600 font-semibold">Error Loading Video</p>
              <p className="text-red-600/80 text-sm">{embedError}</p>
            </div>
          </div>
        ) : (
          <div className="relative aspect-video w-full max-w-6xl mx-auto bg-black rounded-lg overflow-hidden">
            {embedUrl && (
              <iframe
                key={`${mediaType}-${tmdbId}-${season}-${episode}-${server}`}
                src={embedUrl}
                className="w-full h-full"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                title="Video Player"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                onError={() => setEmbedError('Failed to load video player')}
              />
            )}
          </div>
        )}

        <div className="max-w-6xl mx-auto mt-6 flex justify-center gap-2">
          {[1, 2, 3].map((s) => (
            <button
              key={s}
              onClick={() => setServer(s as 1 | 2 | 3)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                server === s
                  ? 'bg-accent text-white'
                  : 'bg-zinc-800 text-white hover:bg-zinc-700'
              }`}
            >
              Server {s}
            </button>
          ))}
        </div>

        <div className="max-w-6xl mx-auto mt-8 text-center text-sm text-muted">
          <p>If the video doesn't load, try switching servers using the buttons above.</p>
          <p className="mt-2">
            This player is powered by{' '}
            <a
              href="https://autoembed.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              AutoEmbed
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
