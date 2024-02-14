const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  date: {
    type: String,
    required: false,
  },
  category: { type: String, required: false },
  amount: { type: Number, required: true, min: 0 }, // Only allow non-negative amounts
  payee: { type: String, required: false },
  description: { type: String, required: true },
  payer: { type: String },
});

module.exports = mongoose.model("Transaction", transactionSchema);
