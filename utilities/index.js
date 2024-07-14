const invModel = require("../models/inventory-model");
const Util = {};

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications();
  let list = "<ul>";
  list += '<li><a href="/" title="Home page">Home</a></li>';
  data.rows.forEach((row) => {
    list += "<li>";
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>";
    list += "</li>";
  });
  list += "</ul>";
  return list;
};

module.exports = Util;

/* **************************************
 * Build the classification view HTML
 * ************************************ */
Util.buildClassificationGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="inv-display">';
    data.forEach((vehicle) => {
      grid += "<li>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        'details"><img src="' +
        vehicle.inv_thumbnail +
        '" alt="Image of ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' on CSE Motors" /></a>';
      grid += '<div class="namePrice">';
      grid += "<hr />";
      grid += "<h2>";
      grid +=
        '<a href="../../inv/detail/' +
        vehicle.inv_id +
        '" title="View ' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        ' details">' +
        vehicle.inv_make +
        " " +
        vehicle.inv_model +
        "</a>";
      grid += "</h2>";
      grid +=
        "<span>$" +
        new Intl.NumberFormat("en-US").format(vehicle.inv_price) +
        "</span>";
      grid += "</div>";
      grid += "</li>";
    });
    grid += "</ul>";
  } else {
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>';
  }
  return grid;
};

/* **************************************
 * Build the details view HTML
 * ************************************ */
Util.buildDetailsCard = async function (data) {
  // Initialize the card variable as an empty string
  let card = '';

  // Extract data properties
  const make = data.inv_make;
  const model = data.inv_model;
  const description = data.inv_description;
  const car_image = data.inv_image;
  const price = data.inv_price;
  const miles = data.inv_miles;
  const color = data.inv_color;

  // Build the card HTML
  card += `<div id="details-card"> <div id="details-img"><img src="${car_image}" alt="Image of ${make} ${model} on CSE Motors" /></div>`;
  card += `<div id="details_desc"><h2>${make} ${model} Details</h2>`;
  card += `<h3>Price: $${new Intl.NumberFormat("en-US").format(price)}</h3>`;
  card += `<h3>Description: ${description}</h3>`;
  card += `<h3>Color: ${color}</h3>`;
  card += `<h3>Miles: ${new Intl.NumberFormat("en-US").format(miles)}</h3></div></div>`;

  // Return the constructed card
  return card;
};


/**
 * Middleware For Handling Errors
 * Wrap Other functions in this for
 * General Error Handling
 * Unit 3, Activities
 */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)
//Promise.resolve accepts a function as a parameter 
//which is why it is considered a higher order function
//If there's an error and the promise fails, the catch.() method picks up the error
// and passes it to the next step in the process.
// that next step will be the Express Error Handler