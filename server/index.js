require("dotenv").config();
const express = require("express");
const cors = require("cors");
const config = require("./config/config");
const logger = require("./utils/logger");
const transactionRoutes = require("./routes/transactionRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const budgetRoutes = require("./routes/budgetRoutes");
const setup = require("./setup");

// ****************************************************
const app = express();
app.use(express.json());
app.use(cors());

const port = config.PORT;

app.use("/api/transactions", transactionRoutes);
app.use("/api/transactions", categoryRoutes);
app.use("/api/transactions", budgetRoutes);

setup().then(() =>
  app.listen(port, () => logger.info(`App listening on port ${port}`))
);
