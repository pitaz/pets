import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { fetchPetBySlug } from "@/lib/api";
import { MediaGallery } from "@/components/MediaGallery";
import { TagPill } from "@/components/TagPill";
import { CommentsSection } from "@/components/CommentsSection";

export const revalidate = 300; // Revalidate every 5 minutes

export default async function PetPage({
  params,
}: {
  params: { slug: string };
}) {
  const pet = await fetchPetBySlug(params.slug);

  if (!pet) {
    notFound();
  }

  return (
    <main className="min-h-screen py-8 bg-gray-50">
      <div className="container-custom max-w-5xl">
        <Link
          href="/pets"
          className="inline-flex items-center text-primary-600 hover:text-primary-700 mb-6 font-medium transition-colors"
        >
          <span className="mr-2">←</span> Back to Pets
        </Link>

        <article className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-r from-primary-500 to-primary-600 px-8 py-8 text-white">
            <h1 className="text-4xl md:text-5xl font-bold mb-2">
              {pet.commonName}
            </h1>
            {pet.scientificName && (
              <p className="text-xl text-primary-100 italic">
                {pet.scientificName}
              </p>
            )}
          </div>

          <div className="p-8">
            {pet.shortIntro && (
              <p className="text-lg text-gray-700 mb-6 leading-relaxed">
                {pet.shortIntro}
              </p>
            )}

            {pet.media && pet.media.length > 0 && (
              <div className="mb-8">
                <MediaGallery media={pet.media} />
              </div>
            )}

            {pet.tags && pet.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-gray-200">
                <span className="text-sm font-medium text-gray-700 mr-2">Tags:</span>
                {pet.tags.map((tag) => (
                  <TagPill key={tag.id} tag={tag} />
                ))}
              </div>
            )}

            {pet.background && (
              <section className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-primary-500 rounded-full mr-3"></span>
                  Background
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">{pet.background}</p>
                </div>
              </section>
            )}

            {pet.history && (
              <section className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-primary-500 rounded-full mr-3"></span>
                  History
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">{pet.history}</p>
                </div>
              </section>
            )}

            {pet.diet && (
              <section className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-secondary-500 rounded-full mr-3"></span>
                  Diet & Nutrition
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">{pet.diet}</p>
                </div>
              </section>
            )}

            {pet.ownershipGuide && (
              <section className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-primary-500 rounded-full mr-3"></span>
                  Ownership Guide
                </h2>
                <div className="prose max-w-none text-gray-700 leading-relaxed">
                  <p className="whitespace-pre-line">{pet.ownershipGuide}</p>
                </div>
              </section>
            )}

            {pet.classifications && pet.classifications.length > 0 && (
              <section className="mb-8 pb-8 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
                  <span className="w-1 h-8 bg-secondary-500 rounded-full mr-3"></span>
                  Classifications
                </h2>
                <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {pet.classifications.map((classification, idx) => (
                    <div
                      key={idx}
                      className="bg-gradient-to-br from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200"
                    >
                      <dt className="font-semibold text-gray-700 text-sm uppercase tracking-wide mb-1">
                        {classification.type}
                      </dt>
                      <dd className="text-gray-900 font-medium">
                        {classification.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            )}

            <CommentsSection petId={pet.id} comments={pet.comments || []} />
          </div>
        </article>
      </div>
    </main>
  );
}
