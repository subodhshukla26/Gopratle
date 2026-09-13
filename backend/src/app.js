const cors = require("cors");
const express = require("express");

const healthRoutes = require("./routes/health.routes");
const requirementRoutes = require("./routes/requirement.routes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(express.json());

app.use("/api/health", healthRoutes);
app.use("/api/requirements", requirementRoutes);

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use(errorHandler);

module.exports = app;