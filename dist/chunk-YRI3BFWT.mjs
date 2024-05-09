import {
  BadRequest
} from "./chunk-F2LQ4BNN.mjs";
import {
  prisma
} from "./chunk-X66UGK5S.mjs";

// src/routes/check-in.ts
import z from "zod";
async function checkIn(app) {
  app.withTypeProvider().get("/attendde/:attenddeId/check-in", {
    schema: {
      summary: "Check-In an attendee",
      tags: ["check-in"],
      params: z.object({
        attenddeId: z.coerce.number().int()
      }),
      response: {
        201: z.object({
          checkInId: z.number()
        })
      }
    }
  }, async (req, reply) => {
    const { attenddeId } = req.params;
    const attenddeCheckIn = await prisma.checkIn.findUnique({
      where: {
        attenddeId
      }
    });
    if (attenddeCheckIn) {
      throw new BadRequest("Attendde already checked in");
    }
    const checkIn2 = await prisma.checkIn.create({
      data: {
        attenddeId
      }
    });
    return reply.status(201).send({ checkInId: checkIn2.id });
  });
}

export {
  checkIn
};
