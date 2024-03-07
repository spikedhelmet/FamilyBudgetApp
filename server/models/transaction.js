const mongoose = require("mongoose");
const Category = require("./categorySchema");

const transactionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: false,
  },
  // category: Category,
  category: { type: String, required: true, unique: true },
  amount: { type: Number, required: true, min: 0 }, // Only allow non-negative amounts
  payee: { type: String, required: false },
  description: { type: String, required: true },
  payer: { type: String },
});

module.exports = mongoose.model("Transaction", transactionSchema);
