// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
//const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

// Route to build individual vehicle view
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildByInventoryId));



module.exports = router;