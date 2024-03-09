const express = require("express");
const router = express.Router();
const budgetController = require("../controllers/budgetController");

router.get("/totalSpending", budgetController.getTotalSpending);

module.exports = router;
