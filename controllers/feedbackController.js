const utilities = require("../utilities");
const feedbackModel = require("../models/feedback-model");
require("dotenv").config();

/* ****************************************
 *  Deliver Report a Bug view
 * *************************************** */
async function buildBug(req, res, next) {
  let nav = await utilities.getNav();
  res.render("errors/bug", {
    title: "Report a Bug!",
    nav,
    errors: null,
  });
}

/* ****************************************
 *  Process Bug
 * *************************************** */
async function registerBug(req, res) {
  let nav = await utilities.getNav();
  const { user_name, bug_text } = req.body;

  const bugResult = await feedbackModel.addBug(user_name, bug_text);

  if (bugResult) {
    req.flash("notice", `Thank you ${user_name} for reporting this bug.`);

    res.status(201).render("errors/bug", {
      title: "Report a bug!",
      nav,
      errors: null,
    });
  } else {
    req.flash("notice", "Sorry, the registration failed.");
    res.status(501).render("errors/bug", {
      title: "Report a bug!",
      nav,
      errors: null,
    });
  }
}

module.exports = { buildBug, registerBug };
