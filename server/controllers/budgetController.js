const Transaction = require("../models/transaction");

exports.getTotalSpending = async (req, res) => {
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
};
