process.env.NODE_ENV = 'test';

const request = require("supertest");
const app = require("../app");
const db = require("../db");

let testCompany;

beforeEach(async () => {
    const res = await db.query(`INSERT INTO companies (code, name, description) VALUES ('dcz', 'dCz Productions', 'Professional DJ services') RETURNING code, name, description`);
    testCompany = res.rows[0];
})

afterEach(async () => {
    await db.query(`DELETE FROM companies`);
})

afterAll(async () => {
    await db.end();
})

describe("GET /companies", () => {
    test("Gets list of companies", async () => {
        const res = await request(app).get("/companies");
        expect(res.statusCode).toBe(200);
    })
})