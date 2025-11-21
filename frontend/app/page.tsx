import Link from "next/link";
import { PetCard } from "@/components/PetCard";
import { SearchBar } from "@/components/SearchBar";
import { fetchPets } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function HomePage() {
  const { data: pets } = await fetchPets({ limit: 12 });

  return (
    <main className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-20">
        <div className="container-custom">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">Legal Pets</h1>
          <p className="text-xl md:text-2xl text-primary-100 mb-8">
            Your comprehensive guide to legal pet ownership
          </p>
          <SearchBar />
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-12 container-custom">
        <h2 className="text-3xl font-bold mb-8">Featured Pets</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {pets?.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link
            href="/pets"
            className="inline-block px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            View All Pets
          </Link>
        </div>
      </section>
    </main>
  );
}
