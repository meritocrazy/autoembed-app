'use client'

import { useAuth, signOut } from '@/lib/hooks/useAuth'
import { User, LogOut, Mail as MailIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProfilePage() {
  const { user, session } = useAuth()
  const router = useRouter()

  async function handleSignOut() {
    try {
      await signOut()
      router.push('/')
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  if (!user || !session) {
    return (
      <div className="flex min-h-[calc(100vh-64px)] items-center justify-center px-4">
        <div className="text-center">
          <User className="h-16 w-16 mx-auto mb-4 text-muted" />
          <h1 className="text-2xl font-bold mb-4">Please sign in</h1>
          <Link href="/login">
            <Button>Sign In</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-20 w-20 bg-accent rounded-full flex items-center justify-center">
              <User className="h-10 w-10 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold mb-1">Profile</h1>
              <p className="text-muted">Manage your account</p>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4 py-4 border-b border-border">
              <MailIcon className="h-5 w-5 text-muted" />
              <div className="flex-1">
                <p className="text-sm text-muted mb-1">Email</p>
                <p className="font-medium">{user.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 py-4 border-b border-border">
              <User className="h-5 w-5 text-muted" />
              <div className="flex-1">
                <p className="text-sm text-muted mb-1">Account Created</p>
                <p className="font-medium">
                  {session.user.user_metadata?.created_at
                    ? new Date(session.user.user_metadata.created_at).toLocaleDateString()
                    : new Date().toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/watchlist" className="block mb-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                  My Watchlist
                </Button>
              </Link>
              <Link href="/history" className="block mb-4">
                <Button variant="outline" className="w-full justify-start gap-2">
                  Watch History
                </Button>
              </Link>
            </div>

            <div className="pt-6 border-t border-border">
              <Button
                variant="destructive"
                onClick={handleSignOut}
                className="w-full gap-2"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
