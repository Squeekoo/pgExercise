// Routes for companies

const express = require("express");
const ExpressError = require("../expressError");
const router = express.Router();
const db = require("../db");

// Returns list of companies
router.get("/", async (req, res, next) => {
    try {
        const results = await db.query(`SELECT * FROM companies`);
        return res.json({ companies: results.rows });
    } catch (e) {
        return next(e);
    }
})

// Returns single company
router.get("/:code", async (req, res, next) => {
    try {
        const results = await db.query(`
            SELECT c.code, c.name, i.industry
            FROM companies AS c
            LEFT JOIN companies_industries AS ci
            ON c.code = ci.company_code
            LEFT JOIN industries AS i ON ci.industry_code = i.code    
            WHERE c.code=$1`, [req.params.code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Cannot find company with code of ${code}`, 404)
        }
        const { code, name } = results.rows[0];
        const industries = results.rows.map(i => i.industry);

        return res.json({ code, name, industries });
    } catch (e) {
        return next(e);
    }
})

// Adds a company
router.post("/", async (req, res, next) => {
    try {
        const { code, name, description } = req.body;
        const results = await db.query('INSERT INTO companies (code, name, description) VALUES ($1, $2, $3) RETURNING code, name, description', [code, name, description]);
        return res.status(201).json({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    }
})

// Edits existing company
router.put("/:code", async (req, res, next) => {
    try {
        const { code } = req.params;
        const { name, description } = req.body;
        const results = await db.query('UPDATE companies SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description', [name, description, code]);
        if (results.rows.length === 0) {
            throw new ExpressError(`Cannot edit company with code of ${code}`, 404)
        }
        return res.send({ company: results.rows[0] });
    } catch (e) {
        return next(e);
    }
})

// Deletes company
router.delete("/:code", async (req, res, next) => {
    try {
        const results = await db.query('DELETE FROM companies WHERE code=$1 RETURNING code', [req.params.code]);
        return res.send({ status: "Company deleted." });
    } catch (e) {
        return next(e);
    }
})

module.exports = router;