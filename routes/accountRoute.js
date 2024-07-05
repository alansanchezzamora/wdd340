/**
 * W4 -> Account login Route
 */
//Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");

//Route to account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

module.exports = router;
