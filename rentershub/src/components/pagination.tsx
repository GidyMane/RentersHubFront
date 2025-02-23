"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PaginationProps {
    count: number;
    previous: string | null;
    next: string | null;
    updatePage: () => Promise<void>;
}

export function Pagination({ count, previous, next, updatePage }: PaginationProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const params = new URLSearchParams(searchParams);
    const currentPage = Number(params.get("page")) || 1;
    const limit = Number(params.get("limit")) || 20;
    const offset = Number(params.get("offset")) || 0;

    // Number of pages to show at a time
    const visiblePageCount = 5;
    const [visiblePages, setVisiblePages] = useState<number[]>([]);

    useEffect(() => {
        let start = Math.max(1, currentPage - Math.floor(visiblePageCount / 2));
        const end = Math.min(count, start + visiblePageCount - 1);

        if (end - start < visiblePageCount - 1) {
            start = Math.max(1, end - visiblePageCount + 1);
        }

        setVisiblePages([...Array(end - start + 1)].map((_, index) => start + index));
    }, [currentPage, count]);

    const handlePageChange = async (newPage: number) => {
        if (newPage < 1 || newPage > count) return;

        const newOffset = (newPage - 1) * limit;
        params.set("offset", newOffset.toString());
        params.set("page", newPage.toString());

        await updatePage();
        router.replace(`?${params.toString()}`);
    };

    return (
        <Suspense>
            <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                <div className="flex flex-1 justify-between sm:hidden">
                    <Button onClick={() => handlePageChange(currentPage - 1)} disabled={!previous} variant="outline">
                        Previous
                    </Button>
                    <Button onClick={() => handlePageChange(currentPage + 1)} disabled={!next} variant="outline">
                        Next
                    </Button>
                </div>
                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                        <p className="text-sm text-gray-700">
                            Showing page <span className="font-medium">{currentPage}</span> of{" "}
                            <span className="font-medium">{count}</span>
                        </p>
                    </div>
                    <div>
                        <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                            <Button
                                onClick={() => handlePageChange(currentPage - 1)}
                                disabled={!previous}
                                variant="outline"
                                className="rounded-l-md"
                            >
                                <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                            </Button>

                            {visiblePages[0] > 1 && (
                                <>
                                    <Button onClick={() => handlePageChange(1)} variant="outline">
                                        1
                                    </Button>
                                    {visiblePages[0] > 2 && <span className="px-2">...</span>}
                                </>
                            )}

                            {visiblePages.map((page) => (
                                <Button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    variant={currentPage === page ? "default" : "outline"}
                                    className={`${currentPage === page ? "z-10" : ""} px-4 mx-1 py-2`}
                                >
                                    {page}
                                </Button>
                            ))}

                            {visiblePages[visiblePages.length - 1] < count && (
                                <>
                                    {visiblePages[visiblePages.length - 1] < count - 1 && <span className="px-2">...</span>}
                                    <Button onClick={() => handlePageChange(count)} variant="outline">
                                        {count}
                                    </Button>
                                </>
                            )}

                            <Button
                                onClick={() => handlePageChange(currentPage + 1)}
                                disabled={!next}
                                variant="outline"
                                className="rounded-r-md"
                            >
                                <ChevronRight className="h-5 w-5" aria-hidden="true" />
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
        </Suspense>
    );
}
