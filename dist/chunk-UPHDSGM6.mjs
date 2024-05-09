import {
  generateSlug
} from "./chunk-OLHHCX5H.mjs";
import {
  prisma
} from "./chunk-X66UGK5S.mjs";

// src/routes/create-event.ts
import z from "zod";
async function createEvent(app) {
  app.withTypeProvider().post("/events", {
    schema: {
      summary: "Create an event",
      tags: ["events"],
      body: z.object({
        title: z.string().min(3),
        details: z.string().nullable(),
        maximumAttendee: z.number().int().positive().nullable()
      }),
      response: {
        201: z.object({
          eventId: z.string().cuid()
        })
      }
    }
  }, async (req, reply) => {
    const { title, details, maximumAttendee } = req.body;
    const slug = generateSlug(title);
    const eventWithSameSlug = await prisma.event.findUnique({
      where: {
        slug
      }
    });
    if (eventWithSameSlug) {
      throw new Error("Another event with same title already exists");
    }
    const event = await prisma.event.create({
      data: {
        title,
        details,
        maximumAttendee,
        slug
      }
    });
    return reply.status(201).send({ eventId: event.id });
  });
}

export {
  createEvent
};
