import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
if (typeof window !== "undefined") {
  const token = localStorage.getItem("accessToken");
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }
}

export interface Pet {
  id: string;
  slug: string;
  commonName: string;
  scientificName?: string;
  shortIntro?: string;
  background?: string;
  history?: string;
  diet?: string;
  ownershipGuide?: string;
  status: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  media?: Media[];
  tags?: Tag[];
  classifications?: Classification[];
  comments?: Comment[];
}

export interface Media {
  id: string;
  url: string;
  type: "IMAGE" | "VIDEO" | "DOCUMENT";
  altText?: string;
  width?: number;
  height?: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Classification {
  type: string;
  value: string;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export async function fetchPets(params?: {
  page?: number;
  limit?: number;
  q?: string;
  tag?: string;
  status?: string;
}): Promise<PaginatedResponse<Pet>> {
  try {
    const response = await api.get("/pets", { params });
    return response.data;
  } catch (error) {
    // Return empty response if API is unavailable (e.g., during build)
    if (axios.isAxiosError(error) && error.code === "ECONNREFUSED") {
      return {
        data: [],
        meta: {
          total: 0,
          page: 1,
          limit: params?.limit || 20,
          totalPages: 0,
        },
      };
    }
    throw error;
  }
}

export async function fetchPetBySlug(slug: string): Promise<Pet | null> {
  try {
    const response = await api.get(`/pets/${slug}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    throw error;
  }
}

export async function searchPets(query: string, limit = 10): Promise<Pet[]> {
  const response = await api.get("/search", { params: { q: query, limit } });
  return response.data;
}

export async function getSuggestions(query: string, limit = 5): Promise<Pet[]> {
  const response = await api.get("/search/suggestions", {
    params: { q: query, limit },
  });
  return response.data;
}

export async function fetchTags(): Promise<Tag[]> {
  const response = await api.get("/tags");
  return response.data;
}

// Auth functions
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  name?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name?: string;
    role: string;
  };
  accessToken: string;
  refreshToken: string;
}

export async function login(
  credentials: LoginCredentials
): Promise<AuthResponse> {
  const response = await api.post("/auth/login", credentials);
  return response.data;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  const response = await api.post("/auth/register", data);
  return response.data;
}

export async function refreshToken(
  refreshToken: string
): Promise<{ accessToken: string; refreshToken: string }> {
  const response = await api.post("/auth/refresh", { refreshToken });
  return response.data;
}

// User functions
export async function getProfile() {
  const response = await api.get("/users/me");
  return response.data;
}

export async function addBookmark(petId: string) {
  const response = await api.post("/users/me/bookmarks", { petId });
  return response.data;
}

export async function removeBookmark(petId: string) {
  const response = await api.delete(`/users/me/bookmarks/${petId}`);
  return response.data;
}

// Comments
export async function createComment(petId: string, content: string) {
  const response = await api.post("/comments", { petId, content });
  return response.data;
}

export default api;
