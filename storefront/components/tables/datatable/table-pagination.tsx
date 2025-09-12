"use client";
import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { IPagination } from "@/types";
import { useSearchParams } from "next/navigation";

function TablePagination({
    page,
    totalPages,
    hasNextPage,
    hasPrevPage,
}: IPagination) {
    const searchParams = useSearchParams();

    // Preserve existing query params
    const buildLink = (newPage: number) => {
        const params = new URLSearchParams(searchParams.toString());
        params.set("page", String(newPage));
        return `?${params.toString()}`;
    };

    // Generate page numbers (basic version: first, current, last)
    const getPageNumbers = () => {
        const pages: (number | string)[] = [];

        if (totalPages <= 5) {
            for (let i = 1; i <= totalPages; i++) pages.push(i);
        } else {
            if (page > 2) pages.push(1, "…");
            if (page > 1) pages.push(page - 1);
            pages.push(page);
            if (page < totalPages) pages.push(page + 1);
            if (page < totalPages - 1) pages.push("…", totalPages);
        }

        return pages;
    };

    return (
        <Pagination>
            <PaginationContent>
                {/* Previous */}
                <PaginationItem>
                    <PaginationPrevious
                        href={hasPrevPage ? buildLink(page - 1) : "#"}
                        aria-disabled={!hasPrevPage}
                        className={!hasPrevPage ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {/* Page Numbers */}
                {getPageNumbers().map((p, i) =>
                    p === "…" ? (
                        <PaginationItem key={`ellipsis-${i}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={i}>
                            <PaginationLink href={buildLink(p as number)} isActive={p === page}>
                                {p}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                {/* Next */}
                <PaginationItem>
                    <PaginationNext
                        href={hasNextPage ? buildLink(page + 1) : "#"}
                        aria-disabled={!hasNextPage}
                        className={!hasNextPage ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

export default TablePagination;
