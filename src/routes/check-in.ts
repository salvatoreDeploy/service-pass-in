import { ZodTypeProvider } from "fastify-type-provider-zod"
import { generateSlug } from "../utils/generateSlug"
import { prisma } from "../database/prisma"
import z from "zod"
import { FastifyInstance } from "fastify"
import { BadRequest } from "../error/bad-request"

export async function checkIn(app: FastifyInstance) {
  app.withTypeProvider<ZodTypeProvider>()
    .get('/attendde/:attenddeId/check-in', {
      schema: {
        summary: 'Check-In an attendee',
        tags: ['check-in'],
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
      const { attenddeId } = req.params
      
      const attenddeCheckIn = await prisma.checkIn.findUnique({
        where: {
          attenddeId
        }
      })

      if (attenddeCheckIn) {
        throw new BadRequest('Attendde already checked in')
      }

      const checkIn = await prisma.checkIn.create({
        data: {
          attenddeId
        }
      })

      return reply.status(201).send({ checkInId: checkIn.id })
    })
}