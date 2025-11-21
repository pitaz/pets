import Link from "next/link";
import { PetCard } from "@/components/PetCard";
import { SearchBar } from "@/components/SearchBar";
import { fetchPets, Pet } from "@/lib/api";

export const revalidate = 60; // Revalidate every 60 seconds
export const dynamic = "force-dynamic"; // Prevent static generation issues during build

export default async function HomePage() {
  // Handle API errors gracefully during build/deployment
  let pets: Pet[] = [];
  try {
    const response = await fetchPets({ limit: 12 });
    pets = response.data || [];
  } catch (error) {
    // During build time, API might not be available
    // This is okay - the page will still render and fetch data client-side if needed
    console.warn("Failed to fetch pets during build:", error);
    pets = [];
  }

  return (
    <>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-primary-700 text-white py-20 md:py-28 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              Find Your Perfect
              <span className="block text-secondary-300">Legal Pet</span>
            </h1>
            <p className="text-xl md:text-2xl text-primary-50 mb-10 leading-relaxed">
              Your comprehensive guide to legal pet ownership. Discover detailed
              information about pet backgrounds, history, diet, and care guides.
            </p>
            <div className="max-w-2xl mx-auto mb-8">
              <SearchBar />
            </div>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span>🐾</span>
                <span>Trusted Information</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span>📚</span>
                <span>Expert Guides</span>
              </div>
              <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
                <span>✓</span>
                <span>Legal Compliance</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Pets */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Explore Legal Pets
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Browse our comprehensive catalog of legal pets with detailed
              information about their care, history, and legal requirements.
            </p>
          </div>

          {pets && pets.length > 0 ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {pets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
              <div className="text-center">
                <Link
                  href="/pets"
                  className="inline-flex items-center px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  View All Pets
                  <span className="ml-2">→</span>
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No pets available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📖</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Comprehensive Guides
              </h3>
              <p className="text-gray-600">
                Detailed information about pet care, diet, and legal
                requirements to help you make informed decisions.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Easy Search
              </h3>
              <p className="text-gray-600">
                Find the perfect pet for your lifestyle with our advanced search
                and filtering options.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✓</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Legal Compliance
              </h3>
              <p className="text-gray-600">
                Stay informed about legal requirements and regulations for pet
                ownership in your area.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
