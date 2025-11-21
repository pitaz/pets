import Link from "next/link";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
  queryParams?: Record<string, string>;
}

export function Pagination({
  currentPage,
  totalPages,
  basePath,
  queryParams = {},
}: PaginationProps) {
  const buildUrl = (page: number) => {
    const params = new URLSearchParams({
      ...queryParams,
      page: page.toString(),
    });
    return `${basePath}?${params.toString()}`;
  };

  const pages = [];
  const maxVisible = 5;
  let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
  let endPage = Math.min(totalPages, startPage + maxVisible - 1);

  if (endPage - startPage < maxVisible - 1) {
    startPage = Math.max(1, endPage - maxVisible + 1);
  }

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <nav className="flex justify-center items-center gap-2">
      {currentPage > 1 && (
        <Link
          href={buildUrl(currentPage - 1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Previous
        </Link>
      )}

      {startPage > 1 && (
        <>
          <Link
            href={buildUrl(1)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            1
          </Link>
          {startPage > 2 && <span className="px-2">...</span>}
        </>
      )}

      {pages.map((page) => (
        <Link
          key={page}
          href={buildUrl(page)}
          className={cn(
            "px-4 py-2 rounded-lg transition-colors",
            page === currentPage
              ? "bg-primary-600 text-white"
              : "bg-white border border-gray-300 hover:bg-gray-50"
          )}
        >
          {page}
        </Link>
      ))}

      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="px-2">...</span>}
          <Link
            href={buildUrl(totalPages)}
            className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {totalPages}
          </Link>
        </>
      )}

      {currentPage < totalPages && (
        <Link
          href={buildUrl(currentPage + 1)}
          className="px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Next
        </Link>
      )}
    </nav>
  );
}
