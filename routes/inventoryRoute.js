// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build details cards by inventory id
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildDetailsPage)
);

router.get(
  "/detail/505Error",
  utilities.handleErrors(invController.buildDetailsPage)
);
module.exports = router;
