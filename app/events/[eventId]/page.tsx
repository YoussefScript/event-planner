import { auth } from "@/auth";
import EventActions from "@/components/EventActions";
import RSVPButtons from "@/components/RSVPButtons";
import { RSVPStatus } from "@/lib/models";
import { format } from "date-fns";
import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

export default async function EventPage({
  params,
}: {
  params: Promise<{ eventId: string }>;
}) {
  const { eventId } = await params;

  const session = await auth();

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: {
      user: { select: { name: true, email: true } },
      rsvps: {
        include: {
          user: { select: { name: true, email: true } },
        },
      },
      _count: { select: { rsvps: true } },
    },
  });

  if (!event) {
    notFound();
  }

  let currentRSVP: RSVPStatus | undefined;
  if (session?.user?.id) {
    const userRSVP = event.rsvps.find(
      (rsvp) => rsvp.userId === session.user?.id
    );
    currentRSVP = userRSVP?.status;
  }

  const isOwner = session?.user?.id === event.userId;
  const isPast = new Date(event.date) < new Date();
  const goingRSVPs = event.rsvps.filter((rsvp) => rsvp.status == "GOING");
  const isFull = !!(event.maxAttendees && goingRSVPs.length >= event.maxAttendees);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Event Header */}
      <div className="card p-8">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              {event.title}
            </h1>
            <p className="text-xl text-muted mb-6">{event.description}</p>
          </div>

          {isOwner && <EventActions eventId={event.id} />}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <div>
                <p className="font-medium text-foreground">
                  {format(new Date(event.date), "EEEE, MMMM do, yyyy")}
                </p>
                <p className="text-muted">
                  {format(new Date(event.date), "h:m a")}
                </p>
              </div>
            </div>

            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>

              <span className="text-foreground">{event.location}</span>
            </div>

            <div className="flex items-center">
              <svg
                className="w-5 h-5 mr-3 text-primary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>

              <span className="text-foreground">
                Organized by {event.user.name || event.user.email}
              </span>
            </div>

            {event.maxAttendees && (
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 mr-3 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>

                <span className="text-foreground">
                  {event._count.rsvps} attending / {event.maxAttendees} max
                </span>
              </div>
            )}
          </div>

          {!isPast && (
            <RSVPButtons
              eventId={event.id}
              currentRSVP={currentRSVP}
              isAuthenticated={!!session}
              isFull={isFull && !currentRSVP}
            />
          )}

          {isPast && (
            <div className="text-center p-4">
              <p className="text-muted">This event has already passed</p>
            </div>
          )}
        </div>
      </div>

      {goingRSVPs.length > 0 && (
        <div className="card p-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">
            Attendees ({goingRSVPs.length})
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {goingRSVPs.map((rsvp, key) => (
              <div key={key} className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center font-bold text-sm">
                  {(rsvp.user.name || rsvp.user.email || "U")[0].toUpperCase()}
                </div>
                <span className="text-foreground font-medium">{rsvp.user.name || rsvp.user.email}</span>
              </div>
            ))}
          </div>
        </div>
      )}
      <div className="text-center">
        <Link href="/events" className="btn-secondary">
          ← Back to Events
        </Link>
      </div>
    </div>
  );
}
