const utilities = require("../utilities");
const accountModel = require("../models/account-model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

/* ****************************************
 *  Deliver login view
 * *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Deliver registration view
 * *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav();
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Registration
 * *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav();
  const {
    account_firstname,
    account_lastname,
    account_email,
    account_password,
  } = req.body;

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hashSync(account_password, 10);
  } catch (error) {
    req.flash(
      "notice",
      "Sorry, there was an error processing the registration."
    );
    res.status(500).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,

    hashedPassword
  );

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    );

    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("account/register", {
      title: "Register",
      nav,
      errors: null,
    });
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav();
  const { account_email, account_password } = req.body;
  const accountData = await accountModel.getAccountByEmail(account_email);
  if (!accountData) {
    req.flash("notice", "Please check your credentials and try again.");
    res.status(400).render("account/login", {
      title: "Login",
      nav,
      errors: null,
      account_email,
    });
    return;
  }
  try {
    if (await bcrypt.compare(account_password, accountData.account_password)) {
      delete accountData.account_password;
      const accessToken = jwt.sign(
        accountData,
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: 3600 }
      );
      if (process.env.NODE_ENV === "development") {
        res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 });
      } else {
        res.cookie("jwt", accessToken, {
          httpOnly: true,
          secure: true,
          maxAge: 3600 * 1000,
        });
      }
      return res.redirect("/account/login");
    }
  } catch (error) {
    return new Error("Access Forbidden");
  }
}

/* ****************************************
*  Deliver account management view (on successful login)
* *************************************** */
async function buildVehicleManagement(req, res, next) {     
  let nav = await utilities.getNav()         
  const account_id = res.locals.accountId

  res.render("account/management", {
      title: "Account Management",
      nav,
      errors: null
  })
}

/* ****************************************
*  Deliver update account
* *************************************** */
async function updateAccountView(req, res, next) {   
  account_id = req.params.account_id
  console.log(account_id)  
  const {account_firstname, account_lastname, account_email, account_type} = await accountModel.getAccountByID(account_id)
  let nav = await utilities.getNav()
  res.render("account/update", {
      title: "Update Account",
      nav,
      errors: null,
      account_id,
      account_firstname,
      account_lastname,
      account_email,
      account_type
  })
}

async function updateAccount(req,res, nest){
  const nav = await utilities.getNav()
  const {
      account_firstname,
      account_lastname,
      account_email,
      account_id,
  } = req.body
  const updateResult = await accountModel.updateAccount(
      account_firstname,
      account_lastname,
      account_email,
      account_id,
  )
  if (updateResult){
      req.flash(
          "notice",
          "Success"
      )
      res.redirect("/account/")
  }else{
      req.flash(
          "notice",
          "Update failed"
      )
      res.status(501).render("/account/update",{
          title: "Update Account",
          nav,
          account_id,
          account_firstname,
          account_lastname,
          account_email,
          errors: null
      })
  }
}

async function updatePassword(req,res, nest){
  const nav = await utilities.getNav()
  const {
      account_firstname,
      account_lastname,
      account_email,
      account_id,
      account_password
  } = req.body

  let hashedPassword 
  try {
      hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
      res.status(501).render("/account/update",{
          title: "Update Account",
          nav,
          account_id,
          account_firstname,
          account_lastname,
          account_email,
          errors: null
      })
  }

  const updateResult = await accountModel.updatePassword(
      account_id,
      hashedPassword
  )
  if (updateResult){
      req.flash(
          "notice",
          "Account Successfully Update"
      )
      res.redirect("/account/")
  }else{
      req.flash(
          "notice",
          "Failed to update!  Check entries and try again"
      )
      res.status(501).render("/account/update",{
          title: "Update Account",
          nav,
          account_id,
          account_firstname,
          account_lastname,
          account_email,
          errors: null
      })
  }
}

async function logout(req, res, next){
  res.clearCookie("jwt")
  req.flash(
      "notice",
      "Successfully logged out"
  )
  res.redirect("/")
}

module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildVehicleManagement, updateAccountView, updateAccount, updatePassword, logout };
