import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generateSlug"
import { prisma } from "../database/prisma"
import z from "zod"
import { FastifyInstance } from "fastify"

export async function getEventAttenddes(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .get('/event/:eventId/attenddes', {
      schema: {
        summary: 'Get event attendees',
        tags: ['events'],
        params: z.object({
          eventId: z.string().cuid()
        }),
        querystring: z.object({
          querySearch: z.string().nullish(),
          pageIndex: z.string().nullish().default('0').transform(Number)
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
            ),
            total: z.number()
          })
        }
      }
    }, async (req, reply) => {
      const { eventId } = req.params
      const {pageIndex, querySearch} = req.query

      const [attenddes, total] = await Promise.all([
        prisma.attendde.findMany({
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
            eventId,

          },
          take: 10,
          skip: pageIndex * 10,
          orderBy: {
            createdAt: 'desc'
          }
        }),

        prisma.attendde.count({
          where: querySearch ? {
            eventId,
            name: {
              contains: querySearch
            }
          } : {
            eventId
          }
        })
      ])


      
      return reply.status(200).send({
        attenddes: attenddes.map(attendde => {
          return {
            id: attendde.id,
            name: attendde.name,
            email: attendde.email,
            createdAt: attendde.createdAt,
            checkedInAt: attendde.CheckIn?.createdAt ?? null
          }
        }),
        total,
      })
    })
}