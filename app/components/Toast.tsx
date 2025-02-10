interface ToastProps {
  message: string;
  type: "success" | "error" | "info";
  onClose: () => void;
}

export default function Toast({ message, type, onClose }: ToastProps) {
  const bgColor = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-orange-500",
  }[type];

  return (
    <div
      className={`fixed bottom-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-slide-up z-50`}
    >
      <span>{message}</span>
      <button
        onClick={onClose}
        className="ml-2 hover:text-gray-200 transition-colors"
      >
        ×
      </button>
    </div>
  );
}
