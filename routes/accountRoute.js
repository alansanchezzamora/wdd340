/**
 * W4 -> Account login Route
 */
//Needed Resources
const express = require("express");
const router = new express.Router();
const utilities = require("../utilities");
const accountController = require("../controllers/accountController");
const regValidate = require("../utilities/account-validation");


//Deliver Registration View
// Unit 4, deliver registration view activity
router.get(
  "/register",
  utilities.handleErrors(accountController.buildRegister)
);

//Post regitration form
// Process the registration data
router.post(
  "/register",
  regValidate.registationRules(),
  regValidate.checkRegData,
  utilities.handleErrors(accountController.registerAccount)
)

//Route to account login view
router.get("/login", utilities.handleErrors(accountController.buildLogin));


//Post Login form
// Unit 4
// Blocks login if there isn't a proper email or password
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLoginData,
);

// Process the login attempt
router.post("/login", (req, res) => {
  res.status(200).send("login process");
});

module.exports = router;
