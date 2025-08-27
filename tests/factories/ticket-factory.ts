import { faker } from "@faker-js/faker";

export async function createTicket() {
    return {
        owner: faker.person.fullName(),
        eventId: faker.number.int({ min: 1, max: 1 }),
        code: faker.string.alphanumeric(16).toUpperCase(),
    };
}