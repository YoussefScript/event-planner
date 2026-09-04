"use client";

import { updateEvent } from "@/lib/event-actions";
import { useRouter } from "next/navigation";
import { useActionState, useEffect } from "react";

interface EditFormProps {
  event: {
    id: string;
    title: string;
    description: string;
    date: Date;
    location: string;
    maxAttendees: number | null;
    isPublic: boolean;
  };
}

export default function EditForm({ event }: EditFormProps) {
  const router = useRouter();
  const updateEventWithId = updateEvent.bind(null, event.id);

  const [state, formAction, isPending] = useActionState(updateEventWithId, {
    success: false,
    eventId: null,
    error: "",
  });

  useEffect(() => {
    if (state.success && state.eventId) {
      router.push(`/events/${state.eventId}`);
    }
  }, [state.success, state.eventId, router]);

  // Format date for datetime-local input (YYYY-MM-DDTHH:mm)
  const formattedDate = new Date(
    new Date(event.date).getTime() - new Date(event.date).getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);

  return (
    <form className="space-y-6" action={formAction}>
      <div>
        <label
          htmlFor="title"
          className="block text-sm text-foreground font-medium mb-2"
        >
          Event Title *
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={event.title}
          required
          className="input-field"
          placeholder="Enter event title"
        />
      </div>

      <div>
        <label
          htmlFor="description"
          className="block text-sm text-foreground font-medium mb-2"
        >
          Description *
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={event.description}
          required
          rows={4}
          className="input-field"
          placeholder="Enter event description"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="date"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Date & Time *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            defaultValue={formattedDate}
            required
            className="input-field"
          />
        </div>

        <div>
          <label
            htmlFor="location"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Location *
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={event.location}
            required
            className="input-field"
            placeholder="Enter event location"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label
            htmlFor="maxAttendees"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Maximum Attendees
          </label>
          <input
            type="number"
            id="maxAttendees"
            name="maxAttendees"
            defaultValue={event.maxAttendees ?? ""}
            min="1"
            className="input-field"
            placeholder="Leave empty for unlimited"
          />
        </div>

        <div>
          <label
            htmlFor="isPublic"
            className="block text-sm text-foreground font-medium mb-2"
          >
            Event Visibility
          </label>
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isPublic"
              name="isPublic"
              defaultChecked={event.isPublic}
              className="h-4 w-4 text-primary focus:ring-primary border-slate-600 rounded bg-slate-800"
            />
            <label htmlFor="isPublic" className="text-foreground ml-2 block text-sm">
              Make this event public
            </label>
          </div>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-600/10 border border-red-600/20 rounded-md p-4">
          <p className="text-sm text-red-400">{state.error}</p>
        </div>
      )}

      <div className="flex gap-4">
        <button className="btn-primary" type="submit" disabled={isPending}>
          {isPending ? "Saving..." : "Save Changes"}
        </button>
        <button
          className="btn-secondary"
          type="button"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
