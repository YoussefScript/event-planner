"use client";

import { toggleRSVP } from "@/lib/event-actions";
import { RSVPStatus } from "@/lib/models";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface RSVPButtonsProps {
  eventId: string;
  currentRSVP?: RSVPStatus;
  isAuthenticated?: boolean;
  isFull?: boolean;
}

export default function RSVPButtons({
  eventId,
  currentRSVP,
  isAuthenticated = false,
  isFull = false,
}: RSVPButtonsProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isGoing = currentRSVP === "GOING";

  async function handleToggle() {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    try {
      const result = await toggleRSVP(eventId);
      if (!result.success && result.error) {
        alert(result.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }

  // Event is full and user is not already attending
  if (isFull) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-foreground">
          RSVP to this event
        </h3>
        <div className="flex items-center gap-3 px-5 py-3 rounded-lg border border-red-500/30 bg-red-500/10 w-fit">
          <span className="text-red-400 text-lg">⚠️</span>
          <div>
            <p className="text-red-400 font-semibold text-sm">Event Full</p>
            <p className="text-red-400/70 text-xs">
              This event has reached maximum capacity
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">
        RSVP to this event
      </h3>
      <div>
        <button
          disabled={isLoading}
          onClick={handleToggle}
          className={`px-6 py-2.5 rounded-lg font-medium transition-all flex items-center gap-2 disabled:opacity-50 ${
            isGoing
              ? "bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
              : "btn-primary"
          }`}
        >
          {isLoading ? (
            "Updating..."
          ) : isGoing ? (
            <>
              <span>✓ Attending</span>
              <span className="text-xs opacity-80">(Click to Cancel)</span>
            </>
          ) : (
            "Attend Event"
          )}
        </button>
        {!isAuthenticated && !isGoing && (
          <p className="text-muted text-xs mt-2">
            Sign in required to RSVP
          </p>
        )}
      </div>
    </div>
  );
}
