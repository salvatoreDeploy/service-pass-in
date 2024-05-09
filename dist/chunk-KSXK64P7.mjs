import {
  BadRequest
} from "./chunk-F2LQ4BNN.mjs";
import {
  prisma
} from "./chunk-X66UGK5S.mjs";

// src/routes/registe-for-event.ts
import z from "zod";
async function registerForEvent(app) {
  app.withTypeProvider().post("/events/:eventId/attendde", {
    schema: {
      summary: "Register an attendees",
      tags: ["attendee"],
      body: z.object({
        name: z.string().min(3),
        email: z.string().email()
      }),
      params: z.object({
        eventId: z.string().cuid()
      }),
      response: {
        201: z.object({
          attenddeId: z.number().int()
        })
      }
    }
  }, async (req, reply) => {
    const { eventId } = req.params;
    const { name, email } = req.body;
    const [event, attenddeFromEmail, amountAttenddeForEvent] = await Promise.all([
      prisma.event.findFirst({
        where: {
          id: eventId
        }
      }),
      prisma.attendde.findUnique({
        where: {
          eventId_email: {
            eventId,
            email
          }
        }
      }),
      prisma.attendde.count({
        where: {
          eventId
        }
      })
    ]);
    if (!event) {
      throw new BadRequest("This event does not exist or is not available");
    }
    if (attenddeFromEmail) {
      throw new BadRequest("This e-mail already registered this event");
    }
    if (event.maximumAttendee && amountAttenddeForEvent >= event.maximumAttendee) {
      throw new BadRequest("The maximus number of attenddes for this event has been reached");
    }
    const attendde = await prisma.attendde.create({
      data: {
        name,
        email,
        eventId
      }
    });
    return reply.status(201).send({ attenddeId: attendde.id });
  });
}

export {
  registerForEvent
};
