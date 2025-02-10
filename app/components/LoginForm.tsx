"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed");
      }
      router.push("/search");
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="w-[400px] p-6 bg-gray-800 rounded-lg border border-gray-700 shadow-xl">
        <form onSubmit={handleSubmit} aria-label="Login form">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col items-center gap-2">
              <h1 className="text-2xl font-bold text-orange-500">Fetch</h1>
              <p className="text-gray-400">Find your perfect furry friend</p>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label htmlFor="name" className="text-sm font-bold mb-1 block">
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                  aria-required="true"
                  disabled={isLoading}
                  autoComplete="name"
                />
              </div>

              <div>
                <label htmlFor="email" className="text-sm font-bold mb-1 block">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white focus:outline-none focus:border-orange-500"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                  aria-required="true"
                  disabled={isLoading}
                  autoComplete="email"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500" role="alert">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-md transition-colors disabled:bg-orange-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              aria-label={isLoading ? "Signing in..." : "Sign in"}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>Signing in...</span>
                </>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
