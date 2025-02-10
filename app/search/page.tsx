"use client";

import { useState, useEffect, useCallback } from "react";
import DogGrid from "../components/DogGrid";
import SearchFilters from "../components/SearchFilters";
import { Dog, SearchResponse } from "../types";
import { useRouter } from "next/navigation";
import DogGridSkeleton from "../components/DogGridSkeleton";
import Image from "next/image";
import MatchPrompt from "../components/MatchPrompt";
import Toast from "../components/Toast";

export default function SearchPage() {
  const router = useRouter();
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(0);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedBreed, setSelectedBreed] = useState<string>("");
  const [selectedAgeRange, setSelectedAgeRange] = useState("");
  const [showMatchPrompt, setShowMatchPrompt] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error" | "info";
  } | null>(null);
  const [matchedDog, setMatchedDog] = useState<Dog | null>(null);
  const [zipCodes, setZipCodes] = useState<string[]>([]);

  const getAgeRange = (rangeId: string) => {
    switch (rangeId) {
      case "puppy":
        return { min: 0, max: 1 };
      case "young":
        return { min: 2, max: 5 };
      case "adult":
        return { min: 6, max: 9 };
      case "senior":
        return { min: 10, max: 99 };
      default:
        return null;
    }
  };

  const fetchDogs = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const searchParams = new URLSearchParams({
        size: "30",
        from: (currentPage * 30).toString(),
        sort: `name:${sortOrder}`,
      });

      if (selectedBreed) {
        searchParams.append("breeds", selectedBreed);
      }

      if (zipCodes.length > 0) {
        zipCodes.forEach((zip) => searchParams.append("zipCodes", zip));
      }

      const ageRange = getAgeRange(selectedAgeRange);
      if (ageRange) {
        searchParams.append("ageMin", ageRange.min.toString());
        searchParams.append("ageMax", ageRange.max.toString());
      }

      window.history.replaceState(
        {},
        "",
        `${window.location.pathname}?${searchParams.toString()}`
      );

      const searchResponse = await fetch(`/api/dogs/search?${searchParams}`, {
        credentials: "include",
      });

      if (!searchResponse.ok) throw new Error("Failed to fetch dogs");

      const searchData: SearchResponse = await searchResponse.json();

      const dogsResponse = await fetch("/api/dogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(searchData.resultIds),
      });

      if (!dogsResponse.ok) throw new Error("Failed to fetch dog details");

      const dogsData: Dog[] = await dogsResponse.json();
      setDogs(dogsData);
    } catch (err) {
      console.error("Error fetching dogs:", err);
      setError("Failed to fetch dogs. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [currentPage, sortOrder, selectedBreed, selectedAgeRange, zipCodes]);

  useEffect(() => {
    fetchDogs();
  }, [currentPage, fetchDogs]);

  const toggleFavorite = (dogId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(dogId)) {
        newFavorites.delete(dogId);
      } else {
        newFavorites.add(dogId);
      }
      return newFavorites;
    });
  };

  const generateMatch = async () => {
    if (favorites.size === 0) {
      setToast({
        message: "Please like some dogs first!",
        type: "error",
      });
      return;
    }

    try {
      const response = await fetch("/api/dogs/match", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(Array.from(favorites)),
      });

      if (!response.ok) throw new Error("Failed to generate match");

      const { match } = await response.json();

      const dogResponse = await fetch("/api/dogs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify([match]),
      });

      if (!dogResponse.ok) throw new Error("Failed to fetch matched dog");

      const [matchedDogData] = await dogResponse.json();
      setMatchedDog(matchedDogData);
      setToast({
        message: `You've been matched with ${matchedDogData.name}!`,
        type: "success",
      });
    } catch (err) {
      console.error("Error generating match:", err);
      setToast({
        message: "Failed to generate match. Please try again.",
        type: "error",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error("Logout failed");

      router.push("/");
    } catch (err) {
      console.error("Error logging out:", err);
      setError("Logout failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto max-w-6xl">
      <div className="flex flex-col gap-6 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Find Your Perfect Dog</h1>
          <div className="flex gap-4">
            <button
              onClick={generateMatch}
              disabled={favorites.size === 0}
              className={`px-4 py-2 rounded-md ${
                favorites.size === 0
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-orange-500 hover:bg-orange-600"
              } text-white transition-colors`}
            >
              Generate Match ({favorites.size})
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>

        <SearchFilters
          sortOrder={sortOrder}
          onSortChange={setSortOrder}
          selectedBreed={selectedBreed}
          onBreedChange={setSelectedBreed}
          selectedAgeRange={selectedAgeRange}
          onAgeRangeChange={setSelectedAgeRange}
          onZipCodesChange={setZipCodes}
        />

        {error && <p className="text-sm text-red-500">{error}</p>}

        {loading ? (
          <DogGridSkeleton />
        ) : (
          <DogGrid
            dogs={dogs}
            favorites={favorites}
            onFavoriteToggle={toggleFavorite}
          />
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
            disabled={currentPage === 0}
            className={`px-4 py-2 rounded-md ${
              currentPage === 0
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
            } text-white transition-colors`}
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={dogs.length < 30}
            className={`px-4 py-2 rounded-md ${
              dogs.length < 30
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-800 hover:bg-gray-700"
            } text-white transition-colors`}
          >
            Next
          </button>
        </div>

        {showMatchPrompt && favorites.size === 0 && (
          <MatchPrompt onClose={() => setShowMatchPrompt(false)} />
        )}

        {matchedDog && (
          <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
              <div className="flex flex-col gap-4">
                <h2 className="text-2xl font-bold text-orange-500">
                  It&apos;s a Match! 🎉
                </h2>
                <Image
                  src={matchedDog.img}
                  alt={matchedDog.name}
                  width={480}
                  height={192}
                  className="w-full h-48 object-cover rounded-lg"
                />
                <div className="space-y-2">
                  <h3 className="text-xl font-semibold">{matchedDog.name}</h3>
                  <p className="text-gray-300">Breed: {matchedDog.breed}</p>
                  <p className="text-gray-300">
                    Age: {matchedDog.age} years old
                  </p>
                  <p className="text-gray-300">
                    Location: {matchedDog.zip_code}
                  </p>
                </div>
                <button
                  onClick={() => setMatchedDog(null)}
                  className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-md transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {toast && (
          <Toast
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        )}
      </div>
    </div>
  );
}
