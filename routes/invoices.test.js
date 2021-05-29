process.env.NODE_ENV = 'test';

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testInvoice;
let testCompany;

beforeEach(async () => {
    const resCompany = await db.query(`INSERT INTO companies (code, name, description) VALUES ('dcz', 'dCz Productions', 'Professional DJ services') RETURNING code, name, description`);
    testCompany = resCompany.rows[0];

    const resInvoice = await db.query(`INSERT INTO invoices (comp_code, amt) VALUES ('dcz', 400) RETURNING id, comp_code, amt, paid, add_date, paid_date`);
    testInvoice = resInvoice.rows[0];
})

afterEach(async () => {
    await db.query(`DELETE FROM invoices`);
})

afterAll(async () => {
    await db.end();
})

describe("GET /invoices", () => {
    test("Gets list of invoices", async () => {
        const res = await request(app).get("/invoices");
        expect(res.statusCode).toBe(200);
    })
})