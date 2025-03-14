"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

interface PaginationProps {
  count: number
  previous: string | null
  next: string | null
  updatePage: (page: number) => Promise<void> // Accepts the new page number
}

export function Pagination({ count, previous, next, updatePage }: PaginationProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const params = new URLSearchParams(searchParams)
  const currentPage = Number(params.get("page")) || 1
  const limit = Number(params.get("limit")) || 20

  // Number of pages to show at a time
  const visiblePageCount = 5
  const [visiblePages, setVisiblePages] = useState<number[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let start = Math.max(1, currentPage - Math.floor(visiblePageCount / 2))
    const end = Math.min(Math.max(count, 1), start + visiblePageCount - 1)

    if (end - start < visiblePageCount - 1) {
      start = Math.max(1, end - visiblePageCount + 1)
    }

    setVisiblePages([...Array(end - start + 1)].map((_, index) => start + index))
  }, [currentPage, count, visiblePageCount])

  const handlePageChange = async (newPage: number) => {
    if (newPage < 1 || newPage > count || isLoading) return

    try {
      setIsLoading(true)

      // Update the page using updatePage function
      await updatePage(newPage)

      // Update the URL parameters
      params.set("page", newPage.toString())
      params.set("offset", ((newPage - 1) * limit).toString())

      router.replace(`?${params.toString()}`)
    } catch (error) {
      console.error("Error changing page:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (count <= 1) return null

  return (
    <div className="flex items-center mt-8 justify-between px-4 py-5 sm:px-6 border-t">
      {/* Mobile view */}
      <div className="flex flex-1 justify-between items-center sm:hidden">
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage <= 1 || isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        <span className="text-sm font-medium">
          Page {currentPage} of {Math.max(count, 1)}
        </span>

        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage >= count || isLoading}
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          aria-label="Next page"
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Desktop view */}
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-black">
            Showing page <span className="font-medium text-foreground">{currentPage}</span> of{" "}
            <span className="font-medium text-foreground">{Math.max(count, 1)}</span>
          </p>
        </div>
        <div>
          <nav className="isolate inline-flex items-center space-x-1" aria-label="Pagination">
            <Button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isLoading}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-md"
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {visiblePages[0] > 1 && (
              <>
                <Button
                  onClick={() => handlePageChange(1)}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                  disabled={isLoading}
                >
                  1
                </Button>
                {visiblePages[0] > 2 && <span className="px-2 text-black">•••</span>}
              </>
            )}

            {visiblePages.map((page) => (
              <Button
                key={page}
                onClick={() => handlePageChange(page)}
                variant={currentPage === page ? "default" : "outline"}
                size="icon"
                className={`h-9 w-9 rounded-md ${
                  currentPage === page ? "bg-primary text-primary-foreground hover:bg-primary/90" : "hover:bg-muted"
                }`}
                disabled={isLoading}
                aria-current={currentPage === page ? "page" : undefined}
              >
                {page}
              </Button>
            ))}

            {visiblePages[visiblePages.length - 1] < count && (
              <>
                {visiblePages[visiblePages.length - 1] < count - 1 && (
                  <span className="px-2 text-black">•••</span>
                )}
                <Button
                  onClick={() => handlePageChange(count)}
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 rounded-md"
                  disabled={isLoading}
                >
                  {count}
                </Button>
              </>
            )}

            <Button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= count || isLoading}
              variant="outline"
              size="icon"
              className="h-9 w-9 rounded-md"
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </nav>
        </div>
      </div>
    </div>
  )
}
