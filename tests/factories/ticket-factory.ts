import { faker } from "@faker-js/faker";
import prisma from "database";
import { createEvent } from "./event-factory";

export async function createTicket(eventId?: number) {
  const event = eventId ? { id: eventId } : await createEvent();

  return await prisma.ticket.create({
    data: {
      owner: faker.person.fullName(),
      eventId: event.id,
      code: faker.string.alphanumeric(16),
    },
  });
}

export async function ticketBodyFactory() {
  const event = await createEvent();
  return {
    owner: faker.person.fullName(),
    eventId: event.id,
    code: faker.string.alphanumeric(16),
  };
}