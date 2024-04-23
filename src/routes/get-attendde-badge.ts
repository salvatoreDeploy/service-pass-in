import { FastifyInstance } from "fastify";
import { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { prisma } from "../database/prisma";
import { BadRequest } from "../error/bad-request";

export async function getAttenddeBadge(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>().get('/attendde/:attenddeId/badge', {
    schema: {
      summary: 'Get attendees badge',
      tags: ['attendee'],
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
    const { attenddeId } = req.params
    
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
    })

    if (!attendde) {
      throw new BadRequest('Attendde not found')
    }

    const baseURL = `${req.protocol}://${req.hostname}`

    const checkInURL = new URL(`/attendde/${attenddeId}/check-in`, baseURL)

    return reply.status(200).send({
      badge: {
        id: attendde.id,
        name: attendde.name,
        email: attendde.email,
        checkInURL: checkInURL.toString(),
        eventTitle: attendde.event.title
      }
    })
  })
}