'use client'

import DOMPurify from "dompurify";
import { useState } from "react";

export const UrlShortenerForm = () => {
  const [url, setUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  interface UrlRequest {
    originalUrl: string;
  }
  interface UrlResponse {
    shortUrl: string;
    error?: string;
    message?: string;
    success?: boolean;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("");
    setShortUrl("");
    setIsLoading(true);

    const trimUrl = url.trim();
    if (!trimUrl) {
      setError("URL cannot be empty");
      setIsLoading(false);
      return;
    }

    try {
      new URL(trimUrl);

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl: trimUrl } as UrlRequest),
      });

      const data: UrlResponse = await response.json();

      if (response.ok && data.shortUrl) {
        setShortUrl(data.shortUrl);
      } else {
        setError(data.message || data.error || "Failed to shorten URL");
      }
    } catch (error) {
      setError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-300 min-h-screen flex items-center justify-center ">
      <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">URL Shortener</h1>
          <p className="text-gray-600 mt-2">
            Paste your long URL to make it shorter
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              id="url-input"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={isLoading}
              placeholder="Enter your long URL"
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white p-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
          >
            {isLoading ? <>Generating...</> : <>Generate short Url</>}
          </button>

          {error && (
            <div className="text-center">
              <span className="text-red-500 font-medium text-sm">{error}</span>
            </div>
          )}
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium text-gray-700 mb-3">
            Your Short URL:
          </h3>
          {shortUrl && (
              <p className="mt-6 text-gray-700">
          Shortened URL:{' '}
          <a
            href={DOMPurify.sanitize(shortUrl)}
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {DOMPurify.sanitize(shortUrl)}
          </a>
        </p>
          )}
        </div>
      </div>
    </div>
  );
};
