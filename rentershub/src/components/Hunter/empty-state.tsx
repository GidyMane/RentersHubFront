import { Home } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EmptyStateProps {
  resetFilters: () => void
}

export function EmptyState({ resetFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <Home className="mx-auto h-12 w-12 text-muted-foreground" />
      <h3 className="mt-4 text-lg font-semibold">No Properties Found</h3>
      <p className="mt-2 text-muted-foreground">We couldn't find any properties matching your search criteria.</p>
      <Button onClick={resetFilters} className="mt-4">
        View All Properties
      </Button>
    </div>
  )
}

