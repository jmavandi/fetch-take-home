import { Dog } from "../types";
import { useState } from "react";
import Image from "next/image";

interface DogGridProps {
  dogs: Dog[];
  favorites: Set<string>;
  onFavoriteToggle: (dogId: string) => void;
}

export default function DogGrid({
  dogs,
  favorites,
  onFavoriteToggle,
}: DogGridProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {dogs.map((dog) => (
        <div
          key={dog.id}
          className="border border-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-md"
        >
          <div className="relative w-full h-48">
            <Image
              src={dog.img}
              alt={dog.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
              className="object-cover cursor-pointer group transition-transform hover:scale-105"
              onClick={() => setSelectedImage(dog.img)}
              priority={false}
            />
          </div>
          <div className="relative">
            <div className="absolute top-[-30px] right-2 bg-black bg-opacity-50 text-white text-sm px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              Click to enlarge
            </div>
            <div className="p-4">
              <div className="flex justify-between items-start">
                <h3 className="text-lg font-semibold text-white">{dog.name}</h3>
                <button
                  onClick={() => onFavoriteToggle(dog.id)}
                  className={`p-2 rounded-full ${
                    favorites.has(dog.id)
                      ? "text-orange-500"
                      : "text-gray-400 hover:text-orange-500"
                  }`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill={favorites.has(dog.id) ? "currentColor" : "none"}
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                </button>
              </div>
              <p className="text-gray-400">Breed: {dog.breed}</p>
              <p className="text-gray-400">Age: {dog.age} years old</p>
              <p className="text-gray-400">Location: {dog.zip_code}</p>
            </div>
          </div>
        </div>
      ))}

      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative w-[90vw] h-[90vh]">
            <Image
              src={selectedImage}
              alt="Full size"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>
      )}
    </div>
  );
}
