export default function DogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border border-gray-700 bg-gray-800 rounded-lg overflow-hidden shadow-md"
        >
          <div className="relative w-full h-48">
            <div className="absolute inset-0 bg-gray-700 animate-pulse" />
          </div>
          <div className="p-4">
            <div className="flex justify-between items-start">
              <div className="h-6 w-24 bg-gray-700 rounded animate-pulse" />
              <div className="h-8 w-8 bg-gray-700 rounded-full animate-pulse" />
            </div>
            <div className="mt-2 h-4 w-32 bg-gray-700 rounded animate-pulse" />
            <div className="mt-2 h-4 w-24 bg-gray-700 rounded animate-pulse" />
            <div className="mt-2 h-4 w-28 bg-gray-700 rounded animate-pulse" />
          </div>
        </div>
      ))}
    </div>
  );
}
