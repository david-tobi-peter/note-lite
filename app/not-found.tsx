"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Home } from "lucide-react";
import { useTheme } from "@/hooks";


export default function NotFound() {
  const router = useRouter();
  const [countdown, setCountdown] = useState(3);

  useTheme();

  useEffect(() => {
    if (countdown === 0) {
      router.push("/");
      return;
    }

    const timer = setInterval(() => {
      setCountdown(prevCount => prevCount - 1);
    }, 1000);

    return () => clearInterval(timer);

  }, [countdown, router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-6xl font-bold text-gray-800 dark:text-gray-100">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Redirecting you back home in {countdown} seconds...
        </p>

        <button
          onClick={() => router.push("/")}
          className="inline-flex items-center px-6 py-3 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors shadow-lg cursor-pointer"
        >
          <Home className="w-5 h-5 mr-2" />
          Go Home Now
        </button>
      </div>
    </div>
  );
}