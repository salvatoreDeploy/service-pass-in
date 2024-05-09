import {
  prisma
} from "../chunk-X66UGK5S.mjs";

// src/database/seed.ts
async function seed() {
  await prisma.event.create({
    data: {
      id: "clulzhhzc00002v6rz08k7sr0 ",
      title: "New Event Test",
      slug: "new-event",
      details: "Testando api do evento",
      maximumAttendee: 120
    }
  });
}
seed().then(() => {
  console.log("Database seeded");
  prisma.$disconnect();
});
