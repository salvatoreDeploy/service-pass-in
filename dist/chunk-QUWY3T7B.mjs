import {
  BadRequest
} from "./chunk-F2LQ4BNN.mjs";
import {
  prisma
} from "./chunk-X66UGK5S.mjs";

// src/routes/get-attendde-badge.ts
import z from "zod";
async function getAttenddeBadge(app) {
  app.withTypeProvider().get("/attendde/:attenddeId/badge", {
    schema: {
      summary: "Get attendees badge",
      tags: ["attendee"],
      params: z.object({
        attenddeId: z.coerce.number().int()
      }),
      response: {
        200: z.object({
          badge: z.object({
            id: z.number(),
            name: z.string(),
            email: z.string().email(),
            checkInURL: z.string().url(),
            eventTitle: z.string()
          })
        })
      }
    }
  }, async (req, reply) => {
    const { attenddeId } = req.params;
    const attendde = await prisma.attendde.findUnique({
      select: {
        id: true,
        name: true,
        email: true,
        event: {
          select: {
            title: true
          }
        }
      },
      where: {
        id: attenddeId
      }
    });
    if (!attendde) {
      throw new BadRequest("Attendde not found");
    }
    const baseURL = `${req.protocol}://${req.hostname}`;
    const checkInURL = new URL(`/attendde/${attenddeId}/check-in`, baseURL);
    console.log(checkInURL);
    return reply.status(200).send({
      badge: {
        id: attendde.id,
        name: attendde.name,
        email: attendde.email,
        checkInURL: checkInURL.toString(),
        eventTitle: attendde.event.title
      }
    });
  });
}

export {
  getAttenddeBadge
};
