const Category = require("../models/categorySchema");
const Transaction = require("../models/transaction");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    let categoryNames = [];
    categories.forEach((cat) => categoryNames.push(cat.name));
    res.json(categoryNames);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching categories");
  }
};

exports.getCategoryByName = async (req, res) => {
  try {
    const category = req.params.category;
    const transactions = await Transaction.find({ category: category });
    res.json(transactions);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching transactions by category");
  }
};
