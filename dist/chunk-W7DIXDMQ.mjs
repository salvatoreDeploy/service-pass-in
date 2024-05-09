import {
  prisma
} from "./chunk-X66UGK5S.mjs";

// src/routes/get-event-attenddes.ts
import z from "zod";
async function getEventAttenddes(app) {
  app.withTypeProvider().get("/event/:eventId/attenddes", {
    schema: {
      summary: "Get event attendees",
      tags: ["events"],
      params: z.object({
        eventId: z.string().cuid()
      }),
      querystring: z.object({
        querySearch: z.string().nullish(),
        pageIndex: z.string().nullish().default("0").transform(Number)
      }),
      response: {
        200: z.object({
          attenddes: z.array(
            z.object({
              id: z.number(),
              name: z.string(),
              email: z.string().email(),
              createdAt: z.date(),
              checkedInAt: z.date().nullish()
            })
          )
        })
      }
    }
  }, async (req, reply) => {
    const { eventId } = req.params;
    const { pageIndex, querySearch } = req.query;
    const attenddes = await prisma.attendde.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        CheckIn: {
          select: {
            createdAt: true
          }
        }
      },
      where: querySearch ? {
        eventId,
        name: {
          contains: querySearch
        }
      } : {
        eventId
      },
      take: 10,
      skip: pageIndex * 10,
      orderBy: {
        createdAt: "desc"
      }
    });
    return reply.status(200).send({
      attenddes: attenddes.map((attendde) => {
        return {
          id: attendde.id,
          name: attendde.name,
          email: attendde.email,
          createdAt: attendde.createdAt,
          checkedInAt: attendde.CheckIn?.createdAt ?? null
        };
      })
    });
  });
}

export {
  getEventAttenddes
};
