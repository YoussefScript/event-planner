"use server";

import { auth } from "@/auth";
import { z } from "zod";
import { prisma } from "./prisma";
import { revalidateTag } from "next/cache";
import { RSVPStatus } from "./models";

const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  date: z.string().min(1, "Date is required"),
  location: z.string().min(1, "Location is required"),
  maxAttendees: z.string().nullable().optional(),
});

// eslint-disable-next-line
export async function createEvent(_: any, formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const rawData = {
      title: formData.get("title") ? String(formData.get("title")) : "",
      description: formData.get("description") ? String(formData.get("description")) : "",
      date: formData.get("date") ? String(formData.get("date")) : "",
      location: formData.get("location") ? String(formData.get("location")) : "",
      maxAttendees: formData.get("maxAttendees") ? String(formData.get("maxAttendees")) : null,
    };

    const validatedData = eventSchema.parse(rawData);

    const event = await prisma.event.create({
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        location: validatedData.location,
        maxAttendees: validatedData.maxAttendees
          ? Number(validatedData.maxAttendees)
          : null,
        isPublic: true,
        userId: session.user.id,
      },
    });

    revalidateTag("events");

    return { success: true, eventId: event.id };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, error: "Failed to create event", eventId: null };
  }
}

// eslint-disable-next-line
export async function updateEvent(eventId: string, _: any, formData: FormData) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    if (existingEvent.userId !== session.user.id) {
      return { success: false, error: "Not authorized to edit this event" };
    }

    const rawData = {
      title: formData.get("title") ? String(formData.get("title")) : "",
      description: formData.get("description") ? String(formData.get("description")) : "",
      date: formData.get("date") ? String(formData.get("date")) : "",
      location: formData.get("location") ? String(formData.get("location")) : "",
      maxAttendees: formData.get("maxAttendees") ? String(formData.get("maxAttendees")) : null,
    };

    const validatedData = eventSchema.parse(rawData);

    await prisma.event.update({
      where: { id: eventId },
      data: {
        title: validatedData.title,
        description: validatedData.description,
        date: new Date(validatedData.date),
        location: validatedData.location,
        maxAttendees: validatedData.maxAttendees
          ? Number(validatedData.maxAttendees)
          : null,
        isPublic: true,
      },
    });

    revalidateTag("events");
    revalidateTag(`event-${eventId}`);

    return { success: true, eventId };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, error: error.errors[0].message };
    }

    return { success: false, error: "Failed to update event", eventId: null };
  }
}

export async function deleteEvent(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    if (existingEvent.userId !== session.user.id) {
      return { success: false, error: "Not authorized to delete this event" };
    }

    await prisma.event.delete({
      where: { id: eventId },
    });

    revalidateTag("events");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to delete the event" };
  }
}

export async function toggleRSVP(eventId: string) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { rsvps: { where: { status: "GOING" } } },
        },
      },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (existingRSVP) {
      await prisma.rSVP.delete({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId,
          },
        },
      });
    } else {
      if (
        existingEvent.maxAttendees &&
        existingEvent._count.rsvps >= existingEvent.maxAttendees
      ) {
        return { success: false, error: "Event has reached maximum capacity" };
      }

      await prisma.rSVP.create({
        data: {
          userId: session.user.id,
          eventId,
          status: "GOING",
        },
      });
    }

    revalidateTag("events");
    revalidateTag(`event-${eventId}`);
    revalidateTag("rsvps");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to update RSVP" };
  }
}

export async function rsvpToEvent(eventId: string, status: RSVPStatus) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Not authenticated" };
    }

    const existingEvent = await prisma.event.findUnique({
      where: { id: eventId },
    });

    if (!existingEvent) {
      return { success: false, error: "Event not found" };
    }

    const existingRSVP = await prisma.rSVP.findUnique({
      where: {
        userId_eventId: {
          userId: session.user.id,
          eventId,
        },
      },
    });

    if (existingRSVP) {
      await prisma.rSVP.delete({
        where: {
          userId_eventId: {
            userId: session.user.id,
            eventId,
          },
        },
      });
    } else {
      await prisma.rSVP.create({
        data: {
          userId: session.user.id,
          eventId,
          status: "GOING",
        },
      });
    }

    revalidateTag("events");
    revalidateTag(`event-${eventId}`);
    revalidateTag("rsvps");
    return { success: true };
  } catch (err) {
    console.error(err);
    return { success: false, error: "Failed to RSVP" };
  }
}
