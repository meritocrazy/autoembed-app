'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, Home, Heart, Clock, Film } from 'lucide-react'
import { useAuth, signOut } from '@/lib/hooks/useAuth'
import { Button } from '@/components/ui/button'

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-background/95 to-transparent">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link href="/" className="flex items-center gap-2">
              <Film className="h-6 w-6 text-accent" />
              <span className="text-2xl font-bold text-accent">VidKing</span>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              <Link
                href="/"
                className={`flex items-center gap-2 hover:text-accent transition-colors ${
                  pathname === '/' ? 'text-accent' : 'text-foreground'
                }`}
              >
                <Home className="h-4 w-4" />
                Home
              </Link>
              <Link
                href="/search"
                className={`flex items-center gap-2 hover:text-accent transition-colors ${
                  pathname === '/search' ? 'text-accent' : 'text-foreground'
                }`}
              >
                <Search className="h-4 w-4" />
                Search
              </Link>
              {user && (
                <>
                  <Link
                    href="/watchlist"
                    className={`flex items-center gap-2 hover:text-accent transition-colors ${
                      pathname === '/watchlist' ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    <Heart className="h-4 w-4" />
                    Watchlist
                  </Link>
                  <Link
                    href="/history"
                    className={`flex items-center gap-2 hover:text-accent transition-colors ${
                      pathname === '/history' ? 'text-accent' : 'text-foreground'
                    }`}
                  >
                    <Clock className="h-4 w-4" />
                    History
                  </Link>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <Button variant="ghost" size="icon">
                    <User className="h-5 w-5" />
                  </Button>
                </Link>
                <Button variant="outline" size="sm" onClick={signOut}>
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth-login">
                  <Button variant="ghost">Sign In</Button>
                </Link>
                <Link href="/auth-signup">
                  <Button>Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
