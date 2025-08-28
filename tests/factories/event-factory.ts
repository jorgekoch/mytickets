import { faker } from "@faker-js/faker";
import prisma from "database";

export async function createEvent() {
    return await prisma.event.create({
        data: {
            name: faker.lorem.words(3),
            date: faker.date.future()
        }
    });
}

export async function eventBodyFactory() {
    return {
        name: faker.lorem.words(3),
        date: faker.date.future()
    }
}