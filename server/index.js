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
const Category = require("./models/categorySchema");

app.get("/", (request, response) => {
  response.send("<h1>Welcome to the backend!</h1>");
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
app.get("/api/transactions/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const transactions = await Transaction.find({});
    const transaction = transactions.find((t) => t.id === id);
    if (transaction) {
      res.json(transaction);
    } else {
      next();
    }
  } catch (err) {
    console.error(err);
    next();
  }
});

// ****************************************************
// * GET Request for a category
app.get("/api/transactions/category/:category", async (req, res) => {
  try {
    const category = req.params.category;
    const transactions = await Transaction.find({ category: category });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching transactions by category");
  }
});

// ****************************************************
// * GET Request for a list of categories
app.get("/api/transactions/categories/", async (req, res) => {
  try {
    const categories = await Category.find({});
    let categoryNames = [];
    categories.forEach((cat) => categoryNames.push(cat.name));
    res.json(categoryNames);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching categories");
  }
});

// * POST new category

// async function createCategories() {
//   try {
//     const categories = [
//       "Housing",
//       "Utilities",
//       "Food",
//       "Transport",
//       "Health",
//       "Education",
//       "Entertainment",
//       "Credit",
//       "Savings",
//       "Other",
//     ];

//     for (const categoryName of categories) {
//       const newCategory = new Category({ name: categoryName });
//       await newCategory.save();
//     }

//     console.log("Categories created!");
//   } catch (err) {
//     console.error(err);
//   }
// }

// createCategories();

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
    if (error.name === "MongoError" && error.code === 11000) {
      // Duplicate key error
      res.status(400).json({ error: "Category already exists" });
    } else {
      console.error(error);
      res.status(500).send("Error posting transaction");
    }
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

// * GET Total Spending
app.get("/api/transactions/totalSpending", async (req, res) => {
  try {
    // const transactions = await Transaction.find({});
    // const total = transactions.reduce((acc, tr) => (acc += tr.amount), 0);
    // res.json(total);
    const total = await Transaction.aggregate([
      { $group: { _id: null, totalSpending: { $sum: "$amount" } } },
    ]);

    res.json(total[0].totalSpending);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: `Failed to get Total Spending: ${err.message}` });
  }
});
// ****************************************************

app.listen(port, () => console.log(`App listening on port ${port}`));
