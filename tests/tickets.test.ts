import app from '../src/index';
import supertest from 'supertest';
import { createEvent } from './factories/event-factory';
import { createTicket, ticketBodyFactory } from './factories/ticket-factory';
import prisma from '../src/database';


const api = supertest(app);

beforeEach(async () => {
    await prisma.ticket.deleteMany({});
    await prisma.event.deleteMany({});
});

describe('GET /tickets/:eventId', () => {
    it("return 200 and an array of tickets", async () => {
        const event = await createEvent();
        await createTicket(event.id);

        const {status, body} = await api.get(`/tickets/${event.id}`);
        expect(status).toBe(200);
        expect(body).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(Number),
                    owner: expect.any(String),
                    eventId: expect.any(Number),
                    code: expect.any(String),
                    used: expect.any(Boolean)
                })
            ])
        )

    });
    
    it("return 404 if event does not exist", async () => {
        const {status} = await api.get('/tickets/9999');
        expect(status).toBe(404);
    });

    it("return 404 if event exists but has no tickets", async () => {
        const event = await createEvent();
        const {status} = await api.get(`/tickets/${event.id}`);
        expect(status).toBe(404);
    });
});



describe('POST /tickets', () => {
    it("return 201 and the created ticket", async () => {
        const newTicket = await ticketBodyFactory();

        const {status, body} = await api.post('/tickets').send(newTicket);
        expect(status).toBe(201);
        expect(body).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                owner: newTicket.owner,
                eventId: newTicket.eventId,
                code: newTicket.code,
                used: false
            })
        );

        const ticketInDb = await prisma.ticket.findUnique({where: {id: body.id}
        });
        expect(ticketInDb).toEqual(
            expect.objectContaining({
                id: expect.any(Number),
                owner: newTicket.owner,
                eventId: newTicket.eventId,
                code: newTicket.code,
                used: false
            })
        );
    })

    it("return 404 when eventId does not exist", async () => {
        const newTicket = await ticketBodyFactory();
        newTicket.eventId = 9999;
        const {status} = await api.post('/tickets').send(newTicket);
        expect(status).toBe(404);

    });

    it("return 409 when ticket code already exists for event", async () => {
        const event = await createEvent();
        const ticketData = await ticketBodyFactory();
        ticketData.eventId = event.id;
        await api.post('/tickets').send(ticketData);
        const {status, body} = await api.post('/tickets').send(ticketData);
        expect(status).toBe(409);
        expect(body).toHaveProperty('message');
    });

    it("return 403 when event date is in the past", async () => {
        const event = await createEvent();
        await prisma.event.update({ where: { id: event.id }, data: { date: new Date('2000-01-01') } });
        const ticketData = await ticketBodyFactory();
        ticketData.eventId = event.id;
        const {status, body} = await api.post('/tickets').send(ticketData);
        expect(status).toBe(403);
        expect(body).toHaveProperty('message');
    })
});


describe('PUT /tickets/use/:id', () => {
    it("return 204 and the updated ticket", async () => {
        const newTicket = await createTicket();

        const {status} = await api.put(`/tickets/use/${newTicket.id}`);
        expect(status).toBe(204);

    });


    it("return 404 when ticket id does not exist", async () => {
        const {status} = await api.put('/tickets/use/9999');
        expect(status).toBe(404);
    });

    it("return 403 when ticket is already used", async () => {
        const ticket = await createTicket();
        await prisma.ticket.update({ where: { id: ticket.id }, data: { used: true } });
        const {status, body} = await api.put(`/tickets/use/${ticket.id}`);
        expect(status).toBe(403);
        expect(body).toHaveProperty('message');
    });

});