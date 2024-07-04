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

module.exports = invCont;


