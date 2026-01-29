import { Film } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-card border-t border-border py-8 mt-20">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Film className="h-5 w-5 text-accent" />
            <span className="text-lg font-bold text-accent">VidKing</span>
          </div>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} VidKing. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://www.themoviedb.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              TMDB
            </a>
            <a
              href="https://autoembed.cc"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted hover:text-accent transition-colors"
            >
              AutoEmbed
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
