"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { fetchTags } from "@/lib/api";
import { Tag } from "@/lib/api";

export function PetFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(
    searchParams.get("tag") || null
  );
  const [searchQuery, setSearchQuery] = useState(
    searchParams.get("q") || ""
  );

  useEffect(() => {
    fetchTags().then(setTags).catch(console.error);
  }, []);

  const handleTagFilter = (tagSlug: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (tagSlug) {
      params.set("tag", tagSlug);
    } else {
      params.delete("tag");
    }
    params.delete("page"); // Reset to first page
    router.push(`/pets?${params.toString()}`);
    setSelectedTag(tagSlug);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (searchQuery.trim()) {
      params.set("q", searchQuery.trim());
    } else {
      params.delete("q");
    }
    params.delete("page");
    router.push(`/pets?${params.toString()}`);
  };

  const clearFilters = () => {
    setSelectedTag(null);
    setSearchQuery("");
    router.push("/pets");
  };

  const hasActiveFilters = selectedTag || searchQuery;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-24">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            Clear All
          </button>
        )}
      </div>

      {/* Search */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Search
        </label>
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search pets..."
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </form>
      </div>

      {/* Tags Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Categories
        </label>
        <div className="space-y-2 max-h-64 overflow-y-auto">
          {tags.map((tag) => (
            <button
              key={tag.id}
              onClick={() =>
                handleTagFilter(selectedTag === tag.slug ? null : tag.slug)
              }
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedTag === tag.slug
                  ? "bg-primary-100 text-primary-700 font-medium border-2 border-primary-300"
                  : "bg-gray-50 text-gray-700 hover:bg-gray-100 border-2 border-transparent"
              }`}
            >
              {tag.name}
            </button>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Use filters to find pets that match your preferences
        </p>
      </div>
    </div>
  );
}

