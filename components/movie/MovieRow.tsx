import { MovieCard } from '@/components/movie/MovieCard'
import { TMDBMovie } from '@/types/tmdb'

interface MovieRowProps {
  title: string
  movies: TMDBMovie[]
}

export function MovieRow({ title, movies }: MovieRowProps) {
  if (!movies || movies.length === 0) return null

  return (
    <div className="py-8">
      <h2 className="text-xl md:text-2xl font-bold mb-4 px-4">{title}</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 px-4 scrollbar-hide">
        {movies.map((movie) => (
          <div key={movie.id} className="flex-shrink-0 w-32 md:w-40 lg:w-48">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>
    </div>
  )
}
