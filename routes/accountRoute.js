// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
//const errorController = require("../controllers/errorController")
const utilities = require("../utilities/")

// Route to account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegister));

// Route to register new account
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;