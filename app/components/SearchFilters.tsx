"use client";

import { useState, useEffect } from "react";
import { FaHeart, FaArrowDown, FaArrowUp } from "react-icons/fa";
import { GiBalloonDog, GiJumpingDog } from "react-icons/gi";
import { FaDog } from "react-icons/fa6";
import zipcodes from "zipcodes";

const AGE_RANGES = [
  { id: "puppy", label: "Puppy", icon: GiBalloonDog, range: "0-2" },
  { id: "young", label: "Young", icon: GiJumpingDog, range: "2-6" },
  { id: "adult", label: "Adult", icon: FaDog, range: "7-9" },
  { id: "senior", label: "Viejito", icon: FaHeart, range: "10+" },
] as const;

const RADIUS_OPTIONS = [
  { value: 10, label: "10 mi" },
  { value: 25, label: "25 mi" },
  { value: 50, label: "50 mi" },
  { value: 100, label: "100 mi" },
  { value: 250, label: "250 mi" },
] as const;

interface SearchFiltersProps {
  sortOrder: "asc" | "desc";
  onSortChange: (order: "asc" | "desc") => void;
  selectedBreed: string;
  onBreedChange: (breed: string) => void;
  selectedAgeRange: string;
  onAgeRangeChange: (range: string) => void;
  onZipCodesChange: (zipCodes: string[]) => void;
}

export default function SearchFilters({
  sortOrder,
  onSortChange,
  selectedBreed,
  onBreedChange,
  selectedAgeRange,
  onAgeRangeChange,
  onZipCodesChange,
}: SearchFiltersProps) {
  const [breeds, setBreeds] = useState<string[]>([]);
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState<number>(0);
  const [locationError, setLocationError] = useState("");
  const [locationInfo, setLocationInfo] = useState<string>("");
  const [debouncedZipCode, setDebouncedZipCode] = useState(zipCode);

  useEffect(() => {
    const fetchBreeds = async () => {
      try {
        const response = await fetch("/api/dogs/breeds", {
          credentials: "include",
        });
        if (!response.ok) throw new Error("Failed to fetch breeds");
        const data = await response.json();
        setBreeds(data);
      } catch (err) {
        console.error("Error fetching breeds:", err);
      }
    };

    fetchBreeds();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedZipCode(zipCode);
    }, 500);

    return () => clearTimeout(timer);
  }, [zipCode]);

  useEffect(() => {
    const handleLocationSearch = async () => {
      setLocationError("");
      setLocationInfo("");

      try {
        if (!/^\d{5}$/.test(debouncedZipCode)) {
          setLocationError("Please enter a valid 5-digit ZIP code");
          return;
        }

        const response = await fetch("/api/locations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify([debouncedZipCode]),
        });

        if (!response.ok) throw new Error("Failed to fetch location info");

        const locations = await response.json();

        if (!Array.isArray(locations) || locations.length === 0) {
          setLocationError("Invalid ZIP code");
          onZipCodesChange([]);
          return;
        }

        const mainLocation = locations[0];
        if (!mainLocation?.city || !mainLocation?.state) {
          setLocationError("Invalid location data");
          onZipCodesChange([]);
          return;
        }

        setLocationInfo(`${mainLocation.city}, ${mainLocation.state}`);

        if (radius === 0) {
          onZipCodesChange([debouncedZipCode]);
        } else {
          const nearbyZips = zipcodes.radius(debouncedZipCode, radius);
          if (!nearbyZips || nearbyZips.length === 0) {
            setLocationError("No locations found within radius");
            onZipCodesChange([]);
            return;
          }
          const limitedZips = nearbyZips
            .slice(0, 100)
            .map((zip) => (typeof zip === "string" ? zip : zip.toString()));
          onZipCodesChange(limitedZips);
        }
      } catch (err) {
        console.error("Error fetching location:", err);
        setLocationError("Invalid ZIP code");
        onZipCodesChange([]);
      }
    };

    if (debouncedZipCode && debouncedZipCode.length === 5) {
      handleLocationSearch();
    } else if (debouncedZipCode.length === 0) {
      onZipCodesChange([]);
      setLocationInfo("");
      setLocationError("");
    }
  }, [debouncedZipCode, radius, onZipCodesChange]);

  return (
    <div
      className="flex flex-col gap-6"
      role="search"
      aria-label="Dog search filters"
    >
      <div className="flex flex-wrap gap-2 justify-center">
        {AGE_RANGES.map((range) => {
          const Icon = range.icon;
          return (
            <button
              key={range.id}
              aria-label={`Filter by ${range.label} age range ${range.range} years`}
              aria-pressed={selectedAgeRange === range.id}
              className={`px-4 py-2 rounded-md transition-colors ${
                selectedAgeRange === range.id
                  ? "bg-orange-500 text-white"
                  : "bg-gray-800 text-gray-300 hover:bg-gray-700"
              }`}
              onClick={() =>
                onAgeRangeChange(selectedAgeRange === range.id ? "" : range.id)
              }
            >
              <div className="flex flex-col items-center gap-1">
                <div className="flex items-center gap-2">
                  <Icon
                    className={`text-lg ${
                      range.id === "senior" ? "text-red-500" : ""
                    }`}
                  />
                  <span className="text-sm">{range.label}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <label
            htmlFor="breed-select"
            className="block text-sm font-medium mb-1"
          >
            Breed
          </label>
          <select
            id="breed-select"
            value={selectedBreed}
            onChange={(e) => onBreedChange(e.target.value)}
            className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500"
            aria-label="Select dog breed"
          >
            <option value="">All Breeds</option>
            {breeds.map((breed) => (
              <option key={breed} value={breed}>
                {breed}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <div className="flex gap-2">
            <div className="flex-1">
              <label
                htmlFor="zip-input"
                className="block text-sm font-medium mb-1"
              >
                Location
              </label>
              <div className="relative">
                <input
                  id="zip-input"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={5}
                  placeholder="Enter ZIP code"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value.slice(0, 5))}
                  className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500"
                  aria-label="Enter ZIP code"
                  aria-describedby={
                    locationError ? "location-error" : undefined
                  }
                />
                {locationInfo && (
                  <p className="absolute -bottom-5 left-0 text-xs text-gray-400">
                    {locationInfo}
                  </p>
                )}
              </div>
              {locationError && (
                <p
                  id="location-error"
                  className="text-xs text-red-500 mt-1"
                  role="alert"
                >
                  {locationError}
                </p>
              )}
            </div>
            <div>
              <label
                htmlFor="radius-select"
                className="block text-sm font-medium mb-1"
              >
                Range
              </label>
              <select
                id="radius-select"
                value={radius}
                onChange={(e) => setRadius(Number(e.target.value))}
                disabled={!zipCode || zipCode.length !== 5}
                className={`w-[120px] flex-shrink-0 px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500 
                  ${
                    !zipCode || zipCode.length !== 5
                      ? "opacity-50 cursor-not-allowed"
                      : "hover:border-orange-500"
                  }`}
                aria-label="Select search radius"
              >
                <option value={0}>None</option>
                {RADIUS_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="min-w-[150px]">
          <label
            htmlFor="sort-button"
            className="block text-sm font-medium mb-1"
          >
            Sort by name
          </label>
          <button
            id="sort-button"
            onClick={() => onSortChange(sortOrder === "asc" ? "desc" : "asc")}
            className="w-full px-3 py-2 rounded-md transition-colors bg-gray-800 text-gray-300 hover:bg-gray-700 flex items-center justify-center gap-2"
            aria-label={`Sort ${
              sortOrder === "asc" ? "descending" : "ascending"
            }`}
          >
            <span>A-Z</span>
            {sortOrder === "asc" ? (
              <FaArrowUp className="text-orange-500" />
            ) : (
              <FaArrowDown className="text-orange-500" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
