// Routes for companies

const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

// Listing all industries, which should show the company code(s) for that industry
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM industries`);
        return res.json({ industries: results.rows })
    } catch (e) {
        return next(e);
    }
})

// Adding industry
router.post("/", async (req, res, next) => {
    try {
        const { code, industry } = req.body;
        const results = await db.query('INSERT INTO industries (code, industry) VALUES ($1, $2) RETURNING code, industry', [code, industry]);
        return res.status(201).json({ industry: results.rows[0] });
    } catch (e) {
        return next(e);
    }
})

// Associating an industry to a company
router.get("/:code", async (req, res, next) => {
    try {
        const industryRes = await db.query(`SELECT code, industry FROM industries WHERE code=$1`, [req.params.code]);

        const companyRes = await db.query(`SELECT company_code, industry_code FROM companies_industries WHERE industry_code=$1`, [req.params.code]);

        if (industryRes.rows.length === 0) {
            throw new ExpressError("Industry not found.", 404)
        }
        const industry = industryRes.rows[0];
        industry.companies = companyRes.rows;
        return res.json(industry);
    } catch (e) {
        return next(e);
    }
})

module.exports = router;