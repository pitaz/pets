"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSuggestions } from "@/lib/api";
import { Pet } from "@/lib/api";

export function SearchBar() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Pet[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const router = useRouter();

  const handleSearch = async (value: string) => {
    setQuery(value);
    if (value.length >= 2) {
      try {
        const results = await getSuggestions(value, 5);
        setSuggestions(results);
        setShowSuggestions(true);
      } catch (error) {
        console.error("Search error:", error);
      }
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/pets?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSelectSuggestion = (slug: string) => {
    router.push(`/pets/${slug}`);
    setShowSuggestions(false);
    setQuery("");
  };

  return (
    <div className="relative w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => handleSearch(e.target.value)}
          onFocus={() => query.length >= 2 && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          placeholder="Search for pets by name, type, or characteristics..."
          className="w-full px-4 py-4 pr-32 rounded-xl text-gray-900 bg-white shadow-lg focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium shadow-md hover:shadow-lg"
        >
          Search
        </button>
      </form>
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
          {suggestions.map((pet) => (
            <button
              key={pet.id}
              onClick={() => handleSelectSuggestion(pet.slug)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="font-medium">{pet.commonName}</div>
              {pet.shortIntro && (
                <div className="text-sm text-gray-600 line-clamp-1">
                  {pet.shortIntro}
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
