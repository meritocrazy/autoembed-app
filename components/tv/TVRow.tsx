import { TVCard } from '@/components/tv/TVCard'
import { TMDBTVShow } from '@/types/tmdb'

interface TVRowProps {
  title: string
  tvShows: TMDBTVShow[]
}

export function TVRow({ title, tvShows }: TVRowProps) {
  if (!tvShows || tvShows.length === 0) return null

  return (
    <div className="py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
        {tvShows.map((tv) => (
          <div key={tv.id} className="flex-shrink-0 w-32 md:w-40 lg:w-48">
            <TVCard tv={tv} />
          </div>
        ))}
      </div>
    </div>
  )
}
