'use client'

import useSWR, { useSWRConfig } from 'swr'
import { supabase } from '@/lib/supabase/client'
import { useAuth } from './useAuth'

async function fetchWatchlist(userId: string) {
  if (!supabase) return []
  
  const { data, error } = await supabase
    .from('watchlist')
    .select('*')
    .eq('user_id', userId)
    .order('added_at', { ascending: false })

  if (error) throw error
  return data
}

export function useWatchlist() {
  const { user } = useAuth()
  const { mutate } = useSWRConfig()

  const { data: watchlist = [], error, isLoading } = useSWR(
    user && supabase ? ['watchlist', user.id] : null,
    () => fetchWatchlist(user!.id)
  )

  async function addToWatchlist(tmdbId: number, mediaType: 'movie' | 'tv') {
    if (!supabase || !user) throw new Error('Supabase client not initialized or user not authenticated')

    const { error } = await supabase
      .from('watchlist')
      .upsert({
        user_id: user.id,
        tmdb_id: tmdbId,
        media_type: mediaType,
      }, {
        onConflict: 'user_id,tmdb_id,media_type',
      })

    if (error) throw error
    
    mutate(['watchlist', user.id])
  }

  async function removeFromWatchlist(id: string) {
    if (!supabase || !user) throw new Error('Supabase client not initialized or user not authenticated')

    const { error } = await supabase
      .from('watchlist')
      .delete()
      .eq('id', id)

    if (error) throw error
    
    mutate(['watchlist', user.id])
  }

  return {
    watchlist,
    isLoading,
    isError: !!error,
    addToWatchlist,
    removeFromWatchlist,
  }
}
