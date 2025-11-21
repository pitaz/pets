import { PetCard } from "@/components/PetCard";
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

  return (
    <main className="min-h-screen py-8">
      <div className="container-custom">
        <h1 className="text-4xl font-bold mb-8">All Pets</h1>
        {pets && pets.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {pets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
            {meta && meta.totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={meta.totalPages}
                basePath="/pets"
              />
            )}
          </>
        ) : (
          <p className="text-gray-600">No pets found.</p>
        )}
      </div>
    </main>
  );
}
