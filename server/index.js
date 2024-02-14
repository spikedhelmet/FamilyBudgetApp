require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// ****************************************************
// * App settings
const app = express();
app.use(cors());
const port = process.env.PORT || 3001;
const url = process.env.URI;
app.use(express.json());

// * Mongoose Logic
mongoose.set("strictQuery", false);
mongoose
  .connect(url)
  .then(console.log("Connected to MongoDb"))
  .catch((error) => console.error(error));

const Transaction = require("./models/transaction");

app.get("/", (request, response) => {
  response.send("<h1>Hello World!</h1>");
});
// ****************************************************

// * GET Request for all transactions
app.get("/api/transactions", async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    console.log("Fetched transactions:", transactions);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching transactions");
  }
});
// ****************************************************

// * GET Request for a single resource
app.get("/api/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const transactions = await Transaction.find({});
    const transaction = transactions.find((t) => t.id === id);
    res.json(transaction);
  } catch (err) {
    console.error(err);
  }
});
// ****************************************************

// * POST Request
app.post("/api/transactions", async (req, res) => {
  try {
    const body = req.body;
    console.log("Request body:", body);

    if (!body.amount || !body.description)
      return res.status(400).json({
        error: "amount or description misssing",
      });

    // Adapt to the mongoose model
    const newTransaction = new Transaction({
      date: body.date,
      category: body.category,
      amount: body.amount,
      payee: body.payee,
      description: body.description,
      payer: body.payer,
    });

    const errors = await newTransaction.validate();
    if (errors) {
      res.status(400).json({ errors: errors.errors });
      return;
    }

    await newTransaction.save();
    res.json({ succes: true, message: "Transaction saved succesfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error posting transaction", error.message);
  }
});
// ****************************************************

// * PUT Request
app.put("/api/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const updateData = {
      date: body.date,
      category: body.category,
      amount: body.amount,
      payee: body.payee,
      description: body.description,
      payer: body.payer,
    };

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(updatedTransaction);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Failed to update transaction: ${err.message}` });
  }
});
// ****************************************************

// * DELETE Request
app.delete("/api/transactions/:id", async (req, res) => {
  try {
    const id = req.params.id;

    const deletedTransaction = await Transaction.findByIdAndDelete(id);

    if (!deletedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }

    res.json(deletedTransaction);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Failed to delete transaction: ${err.message}` });
  }
});
// ****************************************************

app.listen(port, () => console.log(`App listening on port ${port}`));
