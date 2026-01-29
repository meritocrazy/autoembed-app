import Link from 'next/link'
import Image from 'next/image'
import { Play } from 'lucide-react'
import { TMDBTVShow } from '@/types/tmdb'
import { getTMDBImage } from '@/lib/utils'

interface TVCardProps {
  tv: TMDBTVShow
}

export function TVCard({ tv }: TVCardProps) {
  const posterUrl = getTMDBImage(tv.poster_path)
  
  return (
    <div className="group relative h-80 bg-gray-900 rounded-lg overflow-hidden cursor-pointer">
      {/* Poster Image */}
      {posterUrl && (
        <Image
          src={posterUrl}
          alt={tv.name}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      )}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      {/* Content Overlay */}
      <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-white font-bold line-clamp-2 mb-2">{tv.name}</h3>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {tv.vote_average && (
              <span className="text-yellow-400 text-sm font-medium">
                ★ {tv.vote_average.toFixed(1)}
              </span>
            )}
          </div>
          <Link
            href={`/watch/tv/${tv.id}/1/1`}
            className="p-2 bg-blue-600 hover:bg-blue-700 rounded-full text-white transition-colors"
          >
            <Play className="w-4 h-4 fill-white" />
          </Link>
        </div>
      </div>
    </div>
  )
}
