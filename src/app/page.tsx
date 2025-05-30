'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Car, LogIn } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();

  return (
    <div className="h-screen">
      <header className="border-b border-border py-4 px-6 w-full">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Car className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Flexiride</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/register">
              <Button>Register</Button>
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-grow flex flex-col items-center justify-center px-6 py-12 bg-background text-foreground">
        <section className="text-center space-y-6">
          <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
            FlexiRide
          </h1>
          <p className="text-lg sm:text-xl text-muted-foreground">
            Your flexible vehicle rental solution
          </p>
        </section>

        <section className="mt-10 flex flex-col sm:flex-row gap-4">
          <Button
            size="lg"
            onClick={() => router.push('/browse-vehicles')}
            className="min-w-[220px] text-base"
          >
            <Car className="mr-2 h-5 w-5" />
            Browse Vehicles
          </Button>

          <Button
            variant="outline"
            size="lg"
            onClick={() => router.push('/login')}
            className="min-w-[220px] text-base"
          >
            <LogIn className="mr-2 h-5 w-5" />
            Login
          </Button>
        </section>
      </main>
    </div>
  );
}
