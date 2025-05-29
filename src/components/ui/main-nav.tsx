"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Car, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { authService } from "@/services/authService";

export function MainNav() {
  const router = useRouter();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const user = authService.getCurrentUser();
  const isAuthenticated = authService.isAuthenticated();
  
  const handleLogout = () => {
    authService.logout();
    toast.success("Logged out successfully");
    router.push("/");
  };
  
  return (
    <header className="border-b border-border sticky top-0 z-50 bg-background">
      <div className="flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 mr-6">
          <Car className="h-5 w-5" />
          <span className="text-lg font-semibold hidden sm:inline-block">Flexiride</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium flex-1">
          {isAuthenticated && (
            <>
              <Link href="/vehicles" className="transition-colors hover:text-foreground/80">
                Browse Vehicles
              </Link>
              <Link href="/my-bookings" className="transition-colors hover:text-foreground/80">
                My Bookings
              </Link>
            </>
          )}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          {isAuthenticated ? (
            <>
              <div className="hidden md:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {user?.name}
                </span>
              </div>
              <Button variant="ghost" size="icon">
                <User className="h-5 w-5" />
              </Button>
              <Button variant="ghost" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/register">Register</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}