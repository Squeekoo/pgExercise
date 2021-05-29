const express = require("express");
const app = express();
const ExpressError = require("./expressError");

// Parse request bodies for JSON
app.use(express.json());

const companyRoutes = require("./routes/companies");
app.use("/companies", companyRoutes);

const invoicesRoutes = require("./routes/invoices");
app.use("/invoices", invoicesRoutes);

const industryRoutes = require("./routes/industries");
app.use("/industries", industryRoutes);

// 404 Handler
app.use((req, res, next) => {
    const err = new ExpressError("Not Found", 404);

    return next(err);
});

// Generic Err Handler
app.use((err, req, res, next) => {
    let status = err.status || 500;

    return res.status(status).json({
        error: {
            message: err.message,
            status: status
        }
    });
});

module.exports = app;
