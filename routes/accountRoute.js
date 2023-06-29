// Needed Resources 
const express = require("express")
const router = new express.Router() 
const accountController = require("../controllers/accountController")
const utilities = require("../utilities/")
const regValidate = require('../utilities/account-validation')

// Route to account view
router.get("/login", utilities.handleErrors(accountController.buildLogin));

// Route to registration view
router.get("/registration", utilities.handleErrors(accountController.buildRegister));

// Route to register new account
router.post("/register",
regValidate.registrationRules(),
regValidate.checkRegData,
utilities.handleErrors(accountController.registerAccount))

module.exports = router;