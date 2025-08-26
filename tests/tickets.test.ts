import app from '../src/index';
import supertest from 'supertest';
import prisma from 'database';

const api = supertest(app);

beforeEach(async () => {
    await prisma.ticket.deleteMany({});
    await prisma.event.deleteMany({});
});

describe('GET /tickets/:eventId', () => {
    it("return 200 and an array of tickets", async () => {
        const eventId = 1; 
        const {status, body} = await api.get(`/tickets/${eventId}`);
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

});

describe('POST /tickets', () => {
    it("return 201 and the created ticket", async () => {
        const newTicket = {
            owner: "TESTE2",
            eventId: 1,
            code: "TESTETESTETESTE"
        };
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

    })
});


describe('PUT /tickets/use/:id', () => {
    it("return 200 and the updated ticket", async () => {
        const ticketId = 1; 
        const {status, body} = await api.put(`/tickets/use/${ticketId}`);
        expect(status).toBe(204);
        expect(body).toBe("1");

    });

});