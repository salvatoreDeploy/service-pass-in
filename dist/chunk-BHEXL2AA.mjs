import {
  BadRequest
} from "./chunk-F2LQ4BNN.mjs";
import {
  prisma
} from "./chunk-X66UGK5S.mjs";

// src/routes/get-event.ts
import z from "zod";
async function getEvent(app) {
  app.withTypeProvider().get("/event/:eventId", {
    schema: {
      summary: "Get an event",
      tags: ["events"],
      params: z.object({
        eventId: z.string().cuid()
      }),
      response: {
        200: z.object({
          event: z.object({
            id: z.string().cuid(),
            title: z.string(),
            slug: z.string(),
            details: z.string().nullable(),
            maximumAttenddes: z.number().int().nullable(),
            attenddesAmount: z.number().int()
          })
        })
      }
    }
  }, async (req, reply) => {
    const { eventId } = req.params;
    const event = await prisma.event.findUnique({
      select: {
        id: true,
        title: true,
        slug: true,
        details: true,
        maximumAttendee: true,
        _count: {
          select: {
            Attendde: true
          }
        }
      },
      where: {
        id: eventId
      }
    });
    if (!event) {
      throw new BadRequest("Event not found");
    }
    return reply.status(200).send({
      event: {
        id: event.id,
        title: event.title,
        slug: event.slug,
        details: event.details,
        maximumAttenddes: event.maximumAttendee,
        attenddesAmount: event._count.Attendde
      }
    });
  });
}

export {
  getEvent
};
