"use client";

import { toggleRSVP } from "@/lib/event-actions";
import { RSVPStatus } from "@/lib/models";
import { useState } from "react";

interface RSVPButtonsProps {
  eventId: string;
  currentRSVP?: RSVPStatus;
}

export default function RSVPButtons({
  eventId,
  currentRSVP,
}: RSVPButtonsProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isGoing = currentRSVP === "GOING";

  async function handleToggle() {
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
      </div>
    </div>
  );
}
