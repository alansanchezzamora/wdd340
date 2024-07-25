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
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management", {
    title: "Vehicle Managment",
    nav,
    errors: null,
    classificationSelect,
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

/**********************************
 * Return Inventory by Classification as JSON
 * Unit 5, Select Inv Item activity
 ********************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id);
  const invData = await invModel.getInventoryByClassificationId(
    classification_id
  );
  if (invData[0].inv_id) {
    return res.json(invData);
  } else {
    next(new Error("No data returned"));
  }
};

/*******************************
 * Unit 5, get inventory
 */
/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inventory_id = req.params.inventory_id;
  let data = await invModel.getInventoryDetailsById(inventory_id);
  data = data[0];
  const inv_id = data.inv_id;
  const inv_make = data.inv_make;
  const inv_model = data.inv_model;
  const inv_year = data.inv_year;
  const inv_description = data.inv_description;
  const inv_image = data.inv_image;
  const inv_thumbnail = data.inv_thumbnail;
  const inv_price = data.inv_price;
  const inv_miles = data.inv_miles;
  const inv_color = data.inv_color;
  const classification_id = data.classification_id;

  const classificationOptions = await utilities.buildClassificationList(
    classification_id
  );
  const itemName = `${data.inv_make} ${data.inv_model}`;

  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    inventory_id,
    classificationOptions,
    errors: null,
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
  });
};

/* ***************************
 *  Delete Data
 * ************************** */
invCont.deleteInventory = async function (req, res, next) {
  let nav = await utilities.getNav();
  const inv_id = req.body.inventory_id;
  const deleteResult = await invModel.deleteInvModel(inv_id);

  const inv_make = req.body.inv_make;
  const inv_model = req.body.inv_model;
  const itemName = inv_make + " " + inv_model;

  //determine if result was recieved
  if (deleteResult) {
    req.flash("notice", `${itemName} successfully deleted`);
    res.redirect("/inv/");
  } else {
    req.flash("notice", `${itemName} failed to delete.`);
    res.status(501).redirect(`/delete-confirm/${inv_id}`, {
      title: "Delete " + itemName + "!",
      nav,
      errors: null,
    });
  }
};

/* **************************
 * Build Delete Item
 ***************************/
invCont.buildDeleteView = async function (req, res, next) {
  const nav = await utilities.getNav();
  const inventory_id = parseInt(req.params.inventory_id);
  let data = await invModel.deleteInventoryItem(inventory_id);
  data = data[0];
  const inv_id = data.inv_id;
  const inv_make = data.inv_make;
  const inv_model = data.inv_model;
  const inv_year = data.inv_year;
  const inv_price = data.inv_price;
  const itemName = `${data.inv_make} ${data.inv_model}`;

  res.render("./inventory/delete-confirm", {
    title: "Delete " + itemName,
    nav,
    errors: null,
    inv_id,
    inv_make,
    inv_model,
    inv_year,
    inv_price,
  });
};
module.exports = invCont;
