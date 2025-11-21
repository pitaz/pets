"use client";

import { useState, useEffect } from "react";
import { fetchPets } from "@/lib/api";
import { Pet } from "@/lib/api";
import Link from "next/link";

export default function AdminPetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPets() {
      try {
        const response = await fetchPets({ limit: 100 });
        setPets(response.data || []);
      } catch (error) {
        console.error("Failed to load pets:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPets();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Pets</h2>
        <Link
          href="/admin/pets/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
        >
          Add New Pet
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Created
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {pets.map((pet) => (
              <tr key={pet.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {pet.commonName}
                  </div>
                  <div className="text-sm text-gray-500">{pet.slug}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      pet.status === "PUBLISHED"
                        ? "bg-green-100 text-green-800"
                        : pet.status === "DRAFT"
                        ? "bg-yellow-100 text-yellow-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {pet.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(pet.createdAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <Link
                    href={`/pets/${pet.slug}`}
                    className="text-primary-600 hover:text-primary-900 mr-4"
                  >
                    View
                  </Link>
                  <Link
                    href={`/admin/pets/${pet.id}/edit`}
                    className="text-primary-600 hover:text-primary-900"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
