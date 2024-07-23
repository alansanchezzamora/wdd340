// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const regValidate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get(
  "/type/:classificationId",
  utilities.handleErrors(invController.buildByClassificationId)
);

// Route to build details cards by inventory id
router.get(
  "/detail/:inventoryId",
  utilities.handleErrors(invController.buildDetailsPage)
);

//w3 homework, show server error
router.get(
  "/detail/505Error",
  utilities.handleErrors(invController.buildDetailsPage)
);

//w4 homework, show Vehicle Management View
router.get("/", utilities.handleErrors(invController.buildVehicleManagement));

//Deliver Registration View
// Unit 4, deliver registration view activity
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildNewClassification)
);

//Post regitration form
// Unit 4
router.post(
  "/add-classification",
  regValidate.newCategoryRules(),
  regValidate.checkNewCategoryData,
  utilities.handleErrors(invController.registerNewClassification)
);

//Add a new car
router.get(
  "/add-inventory",
  utilities.handleErrors(invController.buildAddInventory)
);

//Post regitration form
// Unit 4
router.post(
  "/add-inventory",
  regValidate.addInventoryRules(),
  regValidate.checkAddInventory,
  utilities.handleErrors(invController.registerInventory)
);

/***************************
 * Get Inventory from AJAX Route
 ************************** */

router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);


/****************
 * 
 */
router.get("/edit/:inventory_id", 
    utilities.handleErrors(invController.buildEditInventory)
)

/*********************************
 * w5 Inventory Update Route
 */
router.post("/update/", 
utilities.handleErrors(invController.updateInventory))

module.exports = router;
