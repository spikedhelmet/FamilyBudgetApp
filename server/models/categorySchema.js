const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Enforce unique category names
    trim: true,
  },
});

module.exports = mongoose.model("Category", categorySchema);
