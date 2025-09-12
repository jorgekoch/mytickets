import app from '../src/index';
import supertest from 'supertest';
import prisma from '../src/database';
import { createEvent, eventBodyFactory } from './factories/event-factory';

const api = supertest(app);

beforeEach(async () => {
    await prisma.ticket.deleteMany({});
    await prisma.event.deleteMany({});
});

describe('GET /events', () => {
    it("return 200 and an array of events", async () => {
        await createEvent();
        
        const {status, body} = await api.get('/events');
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    name: expect.any(String),
                    date: expect.any(String)
                })
            ])
        )

    });

});

describe('POST /events', () => {
  it("return 201 and the event created", async () => {
    const newEvent = await eventBodyFactory();

    const { status, body } = await api.post('/events').send(newEvent);
    expect(status).toBe(201);
    expect(body).toEqual(
      expect.objectContaining({
        id: expect.any(Number),
        name: newEvent.name,
        date: newEvent.date.toISOString(),
      })
    );
  });

  it("return 409 when try to create an event with a name that already exists", async () => {
    const newEvent = await eventBodyFactory();
    await api.post('/events').send(newEvent);
    const { status } = await api.post('/events').send(newEvent);
    expect(status).toBe(409);
  });
});

describe('PUT /events/:id', () => {
  it("return 200 and the event updated", async () => {
    const event = await createEvent();
    const updateData = await eventBodyFactory();

    const { status, body } = await api.put(`/events/${event.id}`).send(updateData);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        id: event.id,
        name: updateData.name,
        date: updateData.date.toISOString(),
      })
    );
  });
});

describe('DELETE /events', () => {
    it("return 204 and the event deleted", async () => {
        const event = await createEvent();
        
        const {status} = await api.delete(`/events/${event.id}`);
        expect(status).toBe(204);

    });

});

describe('GET /events/:id', () => {
  it("return 200 and the event with the given id", async () => {
    const event = await createEvent();
    const { status, body } = await api.get(`/events/${event.id}`);
    expect(status).toBe(200);
    expect(body).toEqual(
      expect.objectContaining({
        id: event.id,
        name: event.name,
        date: event.date.toISOString(),
      })
    );
  })});
