const invModel = require("../models/inventory-model");
const utilities = require("../utilities/");

const invCont = {};

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId; //
  const data = await invModel.getInventoryByClassificationId(classification_id);
  const grid = await utilities.buildClassificationGrid(data);
  let nav = await utilities.getNav();
  const className = data[0].classification_name;
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  });
};

/***********************************
 * Build details card
 * ********************************** */
invCont.buildDetailsPage = async function (req, res, next) {
  const details_id = req.params.inventoryId;
  const data = await invModel.getInventoryDetailsById(details_id);
  const card = await utilities.buildDetailsCard(data);
  let nav = await utilities.getNav();
  let car_title = data.inv_year;
  car_title += " " + data.inv_make;
  car_title += " " + data.inv_model;

  res.render("./inventory/details", {
    title: car_title,
    nav,
    card,
  });
};

/* **************************************
 *     Build Inventory Management
 ************************************** */
invCont.buildVehicleManagement = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/management", {
    title: "Vehicle Managment",
    nav,
  });
};

/****
 * Build New Classification View
 */
invCont.buildNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
  });
};

/* **********************************
 *  Register New Classification View
 ********************************** */
invCont.registerNewClassification = async function (req, res, next) {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;
  const regResult = await invModel.addClassification(classification_name);

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${classification_name}. Please log in.`
    );
    res.status(201).render("inventory/management", {
      title: "Vehicle Management",
      nav,
      errors: null,
    });
  } else {
    req.flash(
      "notice",
      `${classification_name} is invalid <br>Please provide a correct classification name`
    );
    res.status(501).render("inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors: null,
    });
  }
};

/****
 * Build Add Inventory View
 */
invCont.buildAddInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const classificationOptions = await utilities.buildClassificationList();
  res.render("./inventory/add-inventory", {
    title: "Add Car to Inventory",
    nav,
    classificationOptions,
    errors: null,
  });
};

/* ****************************************
 *  Process Inventory
 * *************************************** */
invCont.registerInventory = async function (req, res) {
  let classificationOptions = await utilities.buildClassificationList();
  const nav = await utilities.getNav();
  
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

const regResult = await invModel.addInventory(
  classification_id,
  inv_make,
  inv_model,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_year,
  inv_miles,
  inv_color
);

if (regResult) {
  req.flash(
    "notice",
    `Congratulations, ${inv_model + " " + inv_make} Registered.`
  );

  res.status(201).render("inventory/management", {
    title: "Inventory Management",
    nav,
    classificationOptions,
    errors: null,
  });
} else {
  classificationOptions = await utilities.buildClassificationList(
    classification_id
  );
  req.flash(
    "notice",
    `New Inventory not submitted.  Invalid Entry  <br>Please correct and resubmit`
  );
  res.status(501).render("inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationOptions,
    classification_id,
    inv_year,
    inv_make,
    inv_model,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color,
    errors: null,
  });
}
};
module.exports = invCont;
