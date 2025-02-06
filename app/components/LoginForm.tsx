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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
      setError("Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-800 p-8 rounded-lg shadow-md">
      <h1 className="text-2xl text-orange-500 font-bold text-center mb-6">
        Fetch
      </h1>
      <p className="text-orange-400 text-center mb-6">
        Find your perfect furry friend
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-300"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            required
            className="mt-1 block w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 
            focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
            placeholder-gray-400 transition-colors"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            className="mt-1 block w-full px-4 py-2 rounded-md bg-gray-800 text-white border border-gray-600 
            focus:outline-none focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 
            placeholder-gray-400 transition-colors"
            value={formData.email}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, email: e.target.value }))
            }
          />
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
