export function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-white font-bold mb-4">VidKing</h3>
            <p className="text-gray-400 text-sm">
              Premium streaming experience with minimalist design and fast performance.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/" className="hover:text-white transition-colors">Browse</a></li>
              <li><a href="/search" className="hover:text-white transition-colors">Search</a></li>
              <li><a href="/watchlist" className="hover:text-white transition-colors">Watchlist</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">TMDB</a></li>
              <li><a href="https://vidfast.pro" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">VidFast</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
              <li><a href="#" className="hover:text-white transition-colors">DMCA</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8">
          <p className="text-gray-500 text-sm text-center">
            © {new Date().getFullYear()} VidKing. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
