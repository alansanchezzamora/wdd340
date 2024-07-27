// Needed Resources
const express = require("express");
const router = new express.Router();
const feedbackController = require("../controllers/feedbackController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

//Create route to build view to report bug
router.get("/bug", feedbackController.buildBug);

router.post(
  "/bug",
  regValidate.bugRules(),
  regValidate.checkBugData,
  utilities.handleErrors(feedbackController.registerBug)
);

module.exports = router;
