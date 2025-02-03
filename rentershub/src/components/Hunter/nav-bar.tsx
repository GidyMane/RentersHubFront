import Link from "next/link"
import { Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function NavBar() {
  return (
    <nav className="border-b">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center space-x-8">
          <Link href="/" className="font-bold text-xl">
            Ngoemah
          </Link>
          <div className="hidden md:flex space-x-4">
            <Link href="/buy" className="text-primary font-medium">
              Buy
            </Link>
            <Link href="/sell" className="text-muted-foreground hover:text-primary">
              Sell
            </Link>
            <Link href="/rent" className="text-muted-foreground hover:text-primary">
              Rent
            </Link>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  )
}

