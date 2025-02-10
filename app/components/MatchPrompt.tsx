interface MatchPromptProps {
  onClose: () => void;
}

export default function MatchPrompt({ onClose }: MatchPromptProps) {
  return (
    <div className="fixed bottom-4 left-4 bg-gray-800 border border-gray-700 text-white px-6 py-4 rounded-lg shadow-lg max-w-sm animate-slide-up">
      <button
        onClick={onClose}
        className="absolute top-2 right-2 hover:text-gray-400 transition-colors"
      >
        ×
      </button>
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-orange-500">
          Find Your Perfect Match!
        </h3>
        <p className="text-sm text-gray-300">
          Like a few dogs by clicking the heart icon to get matched with your
          perfect companion. The more dogs you like, the better the match!
        </p>
      </div>
    </div>
  );
}
