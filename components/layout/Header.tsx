'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, User, LogOut, Menu, X } from 'lucide-react'
import { useAuth, signOut } from '@/lib/hooks/useAuth'
import { useState } from 'react'

export function Header() {
  const pathname = usePathname()
  const { user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  const isActive = (path: string) => pathname === path

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center font-bold text-white group-hover:shadow-lg group-hover:shadow-blue-500/30 transition-all">
              VK
            </div>
            <span className="text-xl font-bold text-white">VidKing</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <Link
              href="/search"
              className={`flex items-center gap-2 text-sm font-medium transition-colors ${
                isActive('/search')
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Search className="w-4 h-4" />
              Search
            </Link>

            {user && (
              <>
                <Link
                  href="/watchlist"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/watchlist')
                      ? 'text-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  Watchlist
                </Link>
                <Link
                  href="/history"
                  className={`text-sm font-medium transition-colors ${
                    isActive('/history')
                      ? 'text-blue-400'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  History
                </Link>
              </>
            )}
          </nav>

          {/* Auth Section */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  href="/profile"
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <User className="w-5 h-5 text-gray-400 hover:text-white" />
                </Link>
                <button
                  onClick={signOut}
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-3">
                <Link
                  href="/auth-login"
                  className="text-sm text-gray-400 hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth-signup"
                  className="text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              {menuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-white/10 space-y-3">
            <Link
              href="/search"
              className="block text-sm text-gray-400 hover:text-white transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              Search
            </Link>
            {user && (
              <>
                <Link
                  href="/watchlist"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Watchlist
                </Link>
                <Link
                  href="/history"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  History
                </Link>
              </>
            )}
            {!user && (
              <div className="space-y-2 pt-2">
                <Link
                  href="/auth-login"
                  className="block text-sm text-gray-400 hover:text-white transition-colors"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  href="/auth-signup"
                  className="block text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium text-center"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        )}
      </div>
    </header>
  )
}
