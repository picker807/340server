const utilities = require(".")
const { body, validationResult } = require("express-validator")
const accountModel = require("../models/account-model")
const validate = {}

/*  **********************************
 *  Registration Data Validation Rules
 * ********************************* */
validate.registrationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
    .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email)
        if (emailExists){
          throw new Error("Email exists. Please log in or use different email")
        }
    }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/*  **********************************
 *  Login Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required."),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements."),
  ]
}

/* ******************************
 * Check data and return errors or continue to registration
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to login
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    })
    return
  }
  next()
}

/*  **********************************
 *  Update account Data Validation Rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."), // on error this message is sent.

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."), // on error this message is sent.

    // valid email is required and cannot already exist in the DB
    body("account_email")
    .trim()
    .isEmail()
    .normalizeEmail() // refer to validator.js docs
    .withMessage("A valid email is required.")
     .custom(async (account_email, {req}) => {
      const account_id = req.body.account_id
      const emailResult = await accountModel.checkEmailById(account_id, account_email)
      if (emailResult){
          throw new Error("Email already exists. Please use a different email")
        }
  })]
}

  /*  **********************************
 *  Update password Validation Rules
 * ********************************* */
  validate.updatePasswordRules = () => {
    return [
    body("account_password")
      .trim()
      .isStrongPassword({
        minLength: 12,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1,
      })
      .withMessage("Password does not meet requirements.")
  ]
}

/* ******************************
 * Check data and return errors or continue to update account
 * ***************************** */
validate.checkAccountData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email, account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const itemName = `${res.locals.accountFirstName} ${res.locals.accountLastName}`
  res.render(`./account/update`, {
    title: "Update account for " + itemName,
    nav,
    errors,
    account_id: account_id,
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_email: account_email,
  })
    return
  }
  next()
}

/* ******************************
 * Check data and return errors or continue to update password
 * ***************************** */
validate.checkPasswordData = async (req, res, next) => {
  const { account_id } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    req.flash(
      "notice",
      "Password does not meet requirements")
    res.redirect(`/account/update/${account_id}`)
    return
  }
  next()
}

/*  **********************************
 *  New Review validation rules
 * ********************************* */
validate.newReviewRules = () => {
  return [
    body('review_name')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('Review name is limited to 30 characters long'),
    body('review_rating')
      .trim()
      .isInt({ min: 1, max: 5 })
      .withMessage('Review rating must be an integer between 1 and 5'),
    body('review_text')
      .trim()
      .isLength({ min:3, max: 1000 })
      .withMessage('Review text is limited to 1000 characters long'),
  ]
}

/* ******************************
 * Check Review Data
 * ***************************** */
validate.checkReviewData = async (req, res, next) => {
  const { account_id, review_name, review_rating, review_text } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    const accountData = await accountModel.getAccountById(account_id)
    const userName = `${accountData.account_firstname} 
    ${accountData.account_lastname}`
    res.render("account/review/add-review", {
      title: `${userName}'s Review`,
      nav,
      errors,
      review_name,
      review_rating,
      review_text
    })
    return
  }
  next()
}

module.exports = validate