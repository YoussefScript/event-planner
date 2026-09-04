import { auth } from "@/auth";
import EventsList from "@/components/EventsList";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function EventsPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; filter?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;

  const where: any = {}; // eslint-disable-line

  if (sp.search) {
    where.OR = [
      { title: { contains: sp.search, mode: "insensitive" } },
      { description: { contains: sp.search, mode: "insensitive" } },
      { location: { contains: sp.search, mode: "insensitive" } },
    ];
  }

  if (sp.filter === "upcoming") {
    where.date = { gte: new Date() };
  } else if (sp.filter === "past") {
    where.date = { lt: new Date() };
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      user: { select: { name: true, email: true } },
      rsvps: true,
      _count: { select: { rsvps: true } },
    },
    orderBy: { date: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events</h1>
          <p className="text-muted mt-2">
            Discover and join amazing events in your area
          </p>
        </div>
        {session && (
          <Link href="/events/create" className="btn-primary">
            Create Event
          </Link>
        )}
      </div>

      <EventsList
        events={events}
        searchParams={sp}
        isAuthenticated={!!session}
      />
    </div>
  );
}
