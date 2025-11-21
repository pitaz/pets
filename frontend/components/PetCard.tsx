import Link from "next/link";
import Image from "next/image";
import { Pet } from "@/lib/api";
import { TagPill } from "./TagPill";

interface PetCardProps {
  pet: Pet;
}

export function PetCard({ pet }: PetCardProps) {
  const mainImage = pet.media?.find((m) => m.type === "IMAGE");

  return (
    <Link
      href={`/pets/${pet.slug}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow overflow-hidden"
    >
      {mainImage ? (
        <div className="relative w-full h-48 bg-gray-200">
          <Image
            src={mainImage.url}
            alt={mainImage.altText || pet.commonName}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        </div>
      ) : (
        <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
          <span className="text-gray-400">No image</span>
        </div>
      )}
      <div className="p-4">
        <h3 className="text-xl font-semibold mb-2">{pet.commonName}</h3>
        {pet.scientificName && (
          <p className="text-sm text-gray-600 italic mb-2">
            {pet.scientificName}
          </p>
        )}
        {pet.shortIntro && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-3">
            {pet.shortIntro}
          </p>
        )}
        {pet.tags && pet.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {pet.tags.slice(0, 3).map((tag) => (
              <TagPill key={tag.id} tag={tag} size="sm" />
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
