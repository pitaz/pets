import { PetCard } from "@/components/PetCard";
import { PetFilters } from "@/components/PetFilters";
import { fetchPets } from "@/lib/api";
import { Pagination } from "@/components/Pagination";

export const revalidate = 60;

interface SearchParams {
  page?: string;
  q?: string;
  tag?: string;
}

export default async function PetsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const page = parseInt(searchParams.page || "1", 10);
  const { data: pets, meta } = await fetchPets({
    page,
    q: searchParams.q,
    tag: searchParams.tag,
    limit: 20,
  });

  const hasFilters = searchParams.q || searchParams.tag;

  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="container-custom">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
            Browse All Pets
          </h1>
          <p className="text-lg text-gray-600">
            {hasFilters
              ? `Found ${meta?.total || 0} pet${meta?.total !== 1 ? "s" : ""} matching your criteria`
              : "Discover our comprehensive catalog of legal pets"}
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <PetFilters />
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {pets && pets.length > 0 ? (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {pets.map((pet) => (
                    <PetCard key={pet.id} pet={pet} />
                  ))}
                </div>
                {meta && meta.totalPages > 1 && (
                  <div className="flex justify-center">
                    <Pagination
                      currentPage={page}
                      totalPages={meta.totalPages}
                      basePath="/pets"
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                <div className="text-6xl mb-4">🐾</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  No pets found
                </h2>
                <p className="text-gray-600 mb-6">
                  {hasFilters
                    ? "Try adjusting your filters to see more results."
                    : "Check back soon for new pet listings."}
                </p>
                {hasFilters && (
                  <a
                    href="/pets"
                    className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Clear Filters
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
