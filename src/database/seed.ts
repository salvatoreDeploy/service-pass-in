import { Prisma } from "@prisma/client"
import { prisma } from "./prisma"
import { faker } from '@faker-js/faker'
import dayjs from 'dayjs'

async function seed() {
  const eventId = 'clulzhhzc00002v6rz08k7sr0'


  await prisma.event.create({
    data: {
      id: eventId,
      title: 'New Event Test',
      slug: 'new-event',
      details: 'Testando api do evento',
      maximumAttendee: 120
    }
  })


  const attenddesToInsert: Prisma.AttenddeUncheckedCreateInput[] = []

  for (let i = 0; i <= 120; i++) {
    attenddesToInsert.push({
      id: 10000 + i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      eventId,
      createdAt: faker.date.recent({ days: 30, refDate: dayjs().subtract(8, "days").toDate() }),
      CheckIn: faker.helpers.arrayElement<Prisma.CheckInUncheckedCreateNestedOneWithoutAttenddeInput | undefined>([
        undefined,
        {
          create: {
            createdAt: faker.date.recent({ days: 7 }),
          }
        }
      ])
    })
  }

  await Promise.all(attenddesToInsert.map(data => {
    return prisma.attendde.create({
      data,
    })
  }))
}


seed().then(() => {
  console.log('Database seeded')
  prisma.$disconnect()
})