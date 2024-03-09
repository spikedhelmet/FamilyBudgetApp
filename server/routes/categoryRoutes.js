const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");

router.get("/categories", categoryController.getAllCategories);
router.get("/categories/:category", categoryController.getCategoryByName);

module.exports = router;
