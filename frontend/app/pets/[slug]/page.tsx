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
    <main className="min-h-screen py-8">
      <div className="container-custom max-w-4xl">
        <Link
          href="/pets"
          className="text-primary-600 hover:text-primary-700 mb-4 inline-block"
        >
          ← Back to Pets
        </Link>

        <article>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {pet.commonName}
          </h1>
          {pet.scientificName && (
            <p className="text-xl text-gray-600 italic mb-4">
              {pet.scientificName}
            </p>
          )}

          {pet.shortIntro && (
            <p className="text-lg text-gray-700 mb-6">{pet.shortIntro}</p>
          )}

          {pet.media && pet.media.length > 0 && (
            <MediaGallery media={pet.media} />
          )}

          <div className="flex flex-wrap gap-2 my-6">
            {pet.tags?.map((tag) => (
              <TagPill key={tag.id} tag={tag} />
            ))}
          </div>

          {pet.background && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Background</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{pet.background}</p>
              </div>
            </section>
          )}

          {pet.history && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">History</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{pet.history}</p>
              </div>
            </section>
          )}

          {pet.diet && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Diet</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{pet.diet}</p>
              </div>
            </section>
          )}

          {pet.ownershipGuide && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ownership Guide</h2>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{pet.ownershipGuide}</p>
              </div>
            </section>
          )}

          {pet.classifications && pet.classifications.length > 0 && (
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Classifications</h2>
              <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {pet.classifications.map((classification, idx) => (
                  <div key={idx} className="bg-gray-100 p-4 rounded-lg">
                    <dt className="font-semibold text-gray-700">
                      {classification.type}
                    </dt>
                    <dd className="text-gray-900">{classification.value}</dd>
                  </div>
                ))}
              </dl>
            </section>
          )}

          <CommentsSection petId={pet.id} comments={pet.comments || []} />
        </article>
      </div>
    </main>
  );
}
