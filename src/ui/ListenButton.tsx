"use client";

import { useState, useRef, useEffect } from "react";
import { Volume2, VolumeX, Pause, Play, Loader2 } from "lucide-react";

const POLLY_API_URL = "https://api.sudomanaged.com/api/rosen/public/polly/speak";

interface ListenButtonProps {
  text: string;
  className?: string;
  variant?: "primary" | "secondary" | "ghost";
}

export function ListenButton({ text, className = "", variant = "secondary" }: ListenButtonProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isUnavailable, setIsUnavailable] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioBlobUrlRef = useRef<string | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
      }
    };
  }, []);

  const handlePlay = async () => {
    setError(null);

    // If feature is unavailable, do nothing
    if (isUnavailable) return;

    // If paused, resume
    if (isPaused && audioRef.current) {
      audioRef.current.play();
      setIsPaused(false);
      return;
    }

    // If playing, pause
    if (isPlaying && audioRef.current) {
      audioRef.current.pause();
      setIsPaused(true);
      return;
    }

    // Fetch new audio from API server
    setIsLoading(true);

    try {
      const body = { text, voice: "Matthew", engine: "neural" };

      const response = await fetch(POLLY_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      // Handle auth errors gracefully - this endpoint requires authentication
      // that isn't available on public pages. Mark feature as unavailable.
      if (response.status === 401 || response.status === 403) {
        console.log("[ListenButton] Audio service requires authentication - feature unavailable on this page");
        setIsUnavailable(true);
        setIsLoading(false);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Failed to generate speech");
      }

      // Get audio blob
      const audioBlob = await response.blob();

      // Cleanup previous blob URL
      if (audioBlobUrlRef.current) {
        URL.revokeObjectURL(audioBlobUrlRef.current);
      }

      // Create new blob URL
      const blobUrl = URL.createObjectURL(audioBlob);
      audioBlobUrlRef.current = blobUrl;

      // Create audio element
      const audio = new Audio(blobUrl);
      audioRef.current = audio;

      audio.onplay = () => {
        setIsPlaying(true);
        setIsPaused(false);
        setIsLoading(false);
      };

      audio.onpause = () => {
        if (!audio.ended) {
          setIsPaused(true);
        }
      };

      audio.onended = () => {
        setIsPlaying(false);
        setIsPaused(false);
      };

      audio.onerror = () => {
        setError("Failed to play audio");
        setIsPlaying(false);
        setIsPaused(false);
        setIsLoading(false);
      };

      // Play
      await audio.play();
    } catch (err) {
      console.error("[ListenButton] Error:", err);
      setError(err instanceof Error ? err.message : "Failed to generate speech");
      setIsLoading(false);
    }
  };

  const handleStop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsPlaying(false);
    setIsPaused(false);
  };

  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    ghost: "btn-ghost",
  };

  // If feature is unavailable due to auth, show disabled state
  if (isUnavailable) {
    return (
      <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
        <button
          disabled
          className={`${variantClasses[variant]} text-sm py-2 px-4 min-h-[40px] opacity-50 cursor-not-allowed`}
          aria-label="Audio not available"
        >
          <VolumeX className="w-4 h-4" />
          <span>Audio unavailable</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`inline-flex items-center gap-2 ${className}`.trim()}>
      <button
        onClick={handlePlay}
        disabled={isLoading}
        className={`${variantClasses[variant]} text-sm py-2 px-4 min-h-[40px] disabled:opacity-50 disabled:cursor-not-allowed`}
        aria-label={
          isLoading
            ? "Loading..."
            : isPlaying
            ? isPaused
              ? "Resume listening"
              : "Pause"
            : "Listen to this page"
        }
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Loading...</span>
          </>
        ) : isPlaying ? (
          isPaused ? (
            <>
              <Play className="w-4 h-4" />
              <span>Resume</span>
            </>
          ) : (
            <>
              <Pause className="w-4 h-4" />
              <span>Pause</span>
            </>
          )
        ) : (
          <>
            <Volume2 className="w-4 h-4" />
            <span>Listen</span>
          </>
        )}
      </button>
      {isPlaying && (
        <button
          onClick={handleStop}
          className="p-2 text-gray-500 hover:text-gray-700 transition-colors min-h-[40px] min-w-[40px] flex items-center justify-center rounded-lg hover:bg-gray-100"
          aria-label="Stop listening"
        >
          <VolumeX className="w-4 h-4" />
        </button>
      )}
      {error && (
        <span className="text-sm text-red-500" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}

interface PageListenButtonProps {
  pageText: string;
  className?: string;
}

/**
 * A Listen button specifically for page-level narration.
 * Takes a curated script that summarizes the page content
 * (not just reading headings verbatim).
 */
export function PageListenButton({ pageText, className = "" }: PageListenButtonProps) {
  return (
    <ListenButton
      text={pageText}
      variant="secondary"
      className={className}
    />
  );
}
