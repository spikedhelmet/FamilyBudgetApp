const mongoose = require("mongoose");

const totalSpending = new mongoose.Schema({
  amount: {
    type: Number,
  },
});

module.exports = mongoose.model("TotalSpending", totalSpending);
