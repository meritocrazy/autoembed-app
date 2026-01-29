import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`
}

export function getTMDBImage(path: string | null, size: 'w300' | 'w500' | 'w780' | 'original' = 'w500'): string {
  if (!path || typeof path !== 'string' || !path.startsWith('/')) {
    return '/placeholder.svg'
  }
  return `https://image.tmdb.org/t/p/${size}${path}`
}

export function getEmbedURL(
  mediaType: 'movie' | 'tv',
  tmdbId: number,
  season?: number,
  episode?: number,
  server: 1 | 2 | 3 = 1
): string {
  // Validate TMDB ID
  if (!Number.isInteger(tmdbId) || tmdbId <= 0 || tmdbId > 10000000) {
    throw new Error(`Invalid TMDB ID: ${tmdbId}. Must be a positive integer less than 10,000,000`)
  }

  // Validate server parameter
  if (![1, 2, 3].includes(server)) {
    throw new Error(`Invalid server: ${server}. Must be 1, 2, or 3`)
  }

  const serverMap: Record<number, string> = {
    1: 'Alpha',
    2: 'Cobra',
    3: 'Delta'
  }
  
  const serverName = serverMap[server]
  
  if (mediaType === 'movie') {
    return `https://vidfast.pro/movie/${tmdbId}?server=${serverName}&autoPlay=true`
  } else {
    if (season === undefined || episode === undefined) {
      throw new Error('Season and episode numbers are required for TV shows')
    }
    // Validate season and episode
    if (!Number.isInteger(season) || season <= 0) {
      throw new Error(`Invalid season number: ${season}`)
    }
    if (!Number.isInteger(episode) || episode <= 0) {
      throw new Error(`Invalid episode number: ${episode}`)
    }
    return `https://vidfast.pro/tv/${tmdbId}/${season}/${episode}?server=${serverName}&autoPlay=true`
  }
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength).trim() + '...'
}

export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}
