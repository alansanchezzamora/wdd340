// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);


// Route to build details cards by inventory id
router.get("/detail/:inventoryId", invController.buildDetailsPage);

module.exports = router;