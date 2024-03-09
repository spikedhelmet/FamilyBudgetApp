const Transaction = require("../models/transaction");

// GET All
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({});
    console.log("Fetched transactions:", transactions);
    res.json(transactions);
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching transactions");
  }
};

// GET by id
exports.getTransactionById = async (req, res, next) => {
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
};

// POST
exports.createTransaction = async (req, res) => {
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
};

// PUT
exports.updateTransaction = async (req, res) => {
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
};

// DELETE
exports.deleteTransaction = async (req, res) => {
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
};
