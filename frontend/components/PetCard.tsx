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
      className="block bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 hover:border-primary-300 group"
    >
      {/* Image Container */}
      <div className="relative w-full h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden">
        {mainImage ? (
          <Image
            src={mainImage.url}
            alt={mainImage.altText || pet.commonName}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-gray-400 text-4xl">🐾</span>
          </div>
        )}
        {/* Badge overlay */}
        <div className="absolute top-3 right-3">
          <span className="bg-white/90 backdrop-blur-sm text-primary-600 text-xs font-semibold px-3 py-1 rounded-full shadow-sm">
            Available
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-primary-600 transition-colors">
          {pet.commonName}
        </h3>
        {pet.scientificName && (
          <p className="text-sm text-gray-500 italic mb-3">
            {pet.scientificName}
          </p>
        )}
        {pet.shortIntro && (
          <p className="text-sm text-gray-700 line-clamp-2 mb-4 leading-relaxed">
            {pet.shortIntro}
          </p>
        )}
        {pet.tags && pet.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {pet.tags.slice(0, 3).map((tag) => (
              <TagPill key={tag.id} tag={tag} size="sm" />
            ))}
            {pet.tags.length > 3 && (
              <span className="text-xs text-gray-500 px-2 py-1">
                +{pet.tags.length - 3} more
              </span>
            )}
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className="text-primary-600 text-sm font-medium group-hover:text-primary-700">
            Learn More →
          </span>
        </div>
      </div>
    </Link>
  );
}
