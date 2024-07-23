const utilities = require(".");
const accountModel = require("../models/account-model");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim() // sanitizing - removes empty white space that may exists before or after incoming data
      .escape() //transforms special HTML characters with others that can be represented as text.
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail() // refer to validator.js docs
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (emailExists) {
          throw new Error("Email exists. Please login or use different email.");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .notEmpty() //
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};
/* ************************************
 *             Login Rules
 * *********************************** */
validate.loginRules = () => {
  return [
    body("account_email")
      .trim()
      .escape()
      .notEmpty()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(
          account_email
        );
        if (!emailExists) {
          //if it
          throw new Error(
            "Email does not exist.  Please register or use different email"
          );
        }
      }),

    body("account_password")
      .trim()
      .notEmpty()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/* *******************************************
 * ADD A NEW CATEGORY - W4 HOMEWORK
 ******************************************** */

/* ********************************
 *      New Category Rules
 ******************************* */
validate.newCategoryRules = () => {
  return [
    // valid email is required and cannot already exist in the DB
    body("classification_name")
      .trim()
      .escape()
      .notEmpty()
      .matches(/^\w+$/)
      .withMessage("Input must be a single word")
      .isLength({ min: 2 }),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkNewCategoryData = async (req, res, next) => {
  const { classification_name } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `New Category not submitted.  Invalid Entry  <br>Please correct and resubmit`
    );
    res.render("inventory/add-classification", {
      errors,
      title: "Add New Classification",
      nav,
      classification_name,
    });
    return;
  }
  next();
};

/* *******************************************
 * ADD A NEW ITEM TO INVENTORY - W4 HOMEWORK
 ******************************************** */

/* ********************************
 *      New Item to Inventory
 ******************************* */
validate.addInventoryRules = () => {
  return [
    body("classification_id")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .isNumeric()
      .withMessage("Select a valid classification"),

    body("inv_make")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Vehicle Make must be at least 3 characters"),

    body("inv_model")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Vehicle Make must be at least 3 characters"),

    body("inv_description")
      .trim()
      .escape()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Vehicle description is required"),

    body("inv_image")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Path to image is required"),

    body("inv_thumbnail")
      .trim()
      .notEmpty()
      .isLength({ min: 1 })
      .withMessage("Path to thumbnail is required"),

    body("inv_price")
      .trim()
      .notEmpty()
      .isInt({ gt: 0 })
      .withMessage("Price is required"),

    body("inv_year")
      .trim()
      .notEmpty()
      .custom(async (value) => {
        const currentYear = new Date().getFullYear();
        if (value >= 1000 && value <= currentYear) {
          return true;
        }
        throw new Error(
          `Number must be a 4-digit integer less than or equal to the current year (${currentYear}) and greater than 1700.`
        );
      }),

    body("inv_miles")
      .trim()
      .notEmpty()
      .isInt({ min: 0, max: 400000 })
      .withMessage("Milleage between 0 and 400,000 is required"),

    body("inv_color")
      .trim()
      .notEmpty()
      .isLength({ min: 3 })
      .withMessage("Color must be at least 3 characters."),
  ];
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkAddInventory = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `Item not added.  Invalid Entry  <br>Please correct and resubmit`
    );
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkAddInventory = async (req, res, next) => {
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_year,
    inv_miles,
    inv_color,
  } = req.body;
  let errors = [];
  errors = validationResult(req);
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav();
    req.flash(
      "notice",
      `Item not added.  Invalid Entry  <br>Please correct and resubmit`
    );
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classification_id,
      inv_make,
      inv_model,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_year,
      inv_miles,
      inv_color,
    });
    return;
  }
  next();
};

/* ******************************
 * Check data for udpating inventory
 * ******************************/
validate.checkInventoryUpdateData = async (req, res, next) => {     
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
      const { inv_id, classification_id, inv_year, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color } = req.body   
      const nav = await utilities.getNav()
      const itemName = inv_make + " " + inv_model
      const classSelect = await utilities.buildClassificationList(classification_id)
      req.flash("notice", `New Inventory not submitted.  Invalid Entry  <br>Please correct and resubmit`)        
      res.render("./inventory/edit-inventory", {
          errors,
          title: "Edit " + itemName, 
          nav, 
          inv_id,
          classSelect,
          inv_id,
          inv_make,
          inv_model,
          inv_year,
          inv_description,
          inv_image,
          inv_thumbnail,
          inv_price,
          inv_miles,
          inv_color,
          classification_id,
      })
      return
  }
  next()
}


/* ******************************
 * Check data for posting to DB else return errors.  ERRORS TO BE DIRECTED BACK TOTEH "EDIT" (Modify) VIEW
 * ******************************/
validate.checkUpdateData = async (req, res, next) => {     
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {             
      const { classification_id, inv_year, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id } = req.body   
      const nav = await utilities.getNav() 
      const classSelect = await utilities.buildClassificationList(classification_id)
      const itemName = `${inv_make} ${inv_model}`               
      req.flash("notice", `Update to Inventory not submitted.  Invalid Entry  <br>Please correct and resubmit`)
      res.render("inventory/edit-inventory", {
          errors,
          title: "Edit " + itemName,
          nav,
          classification_id, inv_year, inv_make, inv_model, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id,
          classSelect,
  })
  return
  }
  next()
}
module.exports = validate;
