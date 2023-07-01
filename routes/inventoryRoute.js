// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
//const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")
const manValidate = require('../utilities/management-validation')

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build individual vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));

// Route to inventory management page
router.get("/", utilities.handleErrors(invController.buildManagement));

// Route to build Add Classification View
router.get("/newClassification", utilities.handleErrors(invController.buildAddClassification));

// route to build Add Inventory View
router.get("/newinv", utilities.handleErrors(invController.buildAddInventory))

// Route to add new classification
router.post("/newClassification",
manValidate.newClassificationRules(),
manValidate.checkClassData,
utilities.handleErrors(invController.addClassification))

// Route to add new inventory
router.post("/newinv",
manValidate.newInventoryRules(),
manValidate.checkInvData,
utilities.handleErrors(invController.addNewInventory))

module.exports = router;