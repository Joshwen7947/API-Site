require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

// ---------------------------------------------------------------------------
// CORS configuration
// ---------------------------------------------------------------------------
const corsOrigin = process.env.CORS_ORIGIN || "*";
const corsOptions = {
  origin: corsOrigin === "*" ? "*" : corsOrigin.split(",").map((o) => o.trim()),
};
app.use(cors(corsOptions));

// ---------------------------------------------------------------------------
// Body parsers
// ---------------------------------------------------------------------------
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---------------------------------------------------------------------------
// Serve the frontend
// ---------------------------------------------------------------------------
app.use(express.static(path.join(__dirname, "public")));

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
require("./app/routes/tutorial.routes.js")(app);

// ---------------------------------------------------------------------------
// Database connection & server start
// ---------------------------------------------------------------------------
const db = require("./app/models");
const PORT = process.env.PORT || 8080;

db.sequelize
  .authenticate()
  .then(() => {
    console.log("✔  Database connection established successfully.");
    // sync models – use { force: true } in dev to drop & re-create tables
    return db.sequelize.sync({ alter: process.env.NODE_ENV !== "production" });
  })
  .then(() => {
    console.log("✔  Sequelize models synced to the database.");
    app.listen(PORT, () => {
      console.log(`✔  Server is running on port ${PORT}.`);
    });
  })
  .catch((err) => {
    console.error("✖  Failed to connect to the database:", err.message);
    process.exit(1);
  });
