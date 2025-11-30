import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Shield, Swords, TrendingUp, Users } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-800 text-white">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
              COC-SaaS
            </h1>
            <p className="mb-8 text-xl text-slate-300">
              Comprehensive Clan Management Platform for Clash of Clans
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Link href="/auth/register">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Everything Your Clan Needs
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <FeatureCard
              icon={<Swords className="h-8 w-8" />}
              title="War Tracking"
              description="Real-time war attack monitoring with base calling system"
            />
            <FeatureCard
              icon={<Shield className="h-8 w-8" />}
              title="Raid Weekends"
              description="Track capital raids and player contributions"
            />
            <FeatureCard
              icon={<TrendingUp className="h-8 w-8" />}
              title="Analytics"
              description="Deep insights into player performance and progression"
            />
            <FeatureCard
              icon={<Users className="h-8 w-8" />}
              title="Communication"
              description="Advanced chat with channels, threads, and reactions"
            />
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <div className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-4 text-primary">{icon}</div>
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  )
}