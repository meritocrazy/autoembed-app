'use client'

import useSWR, { useSWRConfig } from 'swr'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

interface HistoryParams {
  tmdbId: number
  mediaType: 'movie' | 'tv'
  seasonNumber?: number
  episodeNumber?: number
}

async function fetchHistory(userId: string) {
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('watch_history')
    .select('*')
    .eq('user_id', userId)
    .order('watched_at', { ascending: false })
    .limit(20)

  if (error) throw error
  return data
}

export function useWatchHistory() {
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const { data: history = [], error, isLoading } = useSWR(
    user && supabase ? ['history', user.id] : null,
    () => fetchHistory(user!.id)
  )

  async function addToHistory({
    tmdbId,
    mediaType,
    seasonNumber,
    episodeNumber,
  }: HistoryParams) {
    if (!supabase || !user) throw new Error('Supabase client not initialized or user not authenticated')

    const { error } = await supabase
      .from('watch_history')
      .insert({
        user_id: user.id,
        tmdb_id: tmdbId,
        media_type: mediaType,
        season_number: seasonNumber ?? null,
        episode_number: episodeNumber ?? null,
      })

    if (error) throw error
    
    mutate(['history', user.id])
  }

  async function clearHistory() {
    if (!supabase || !user) throw new Error('Supabase client not initialized or user not authenticated')

    const { error } = await supabase
      .from('watch_history')
      .delete()
      .eq('user_id', user.id)

    if (error) throw error
    
    mutate(['history', user.id], [])
  }

  return {
    history,
    isLoading,
    isError: !!error,
    addToHistory,
    clearHistory,
  }
}
