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
    <Link href={`/tv/${tv.id}`} className="group">
      <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-card card-hover cursor-pointer">
        <Image
          src={posterUrl}
          alt={tv.name}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/0 transition-colors duration-300" />
          <h3 className="text-white font-semibold text-sm mb-2 relative z-10 line-clamp-2">
            {tv.name}
          </h3>
          <p className="text-xs text-white/80 relative z-10">
            {tv.first_air_date ? new Date(tv.first_air_date).getFullYear() : 'TBA'}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <Play className="h-4 w-4 fill-white" />
            <span className="text-sm font-medium">Watch Now</span>
          </div>
        </div>
      </div>
    </Link>
  )
}
