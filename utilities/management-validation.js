const utilities = require(".")
const { body, validationResult } = require("express-validator")
const invModel = require("../models/inventory-model")
const validate = {}

/*******************
 * Rules for new Classification
 ********************/
validate.newClassificationRules= () => {
  return [
    body("classification_name")
    .trim()
    .matches(/^[a-zA-Z0-9]+$/, 'i')
    .withMessage("Classification cannot contain a space or special character.") // on error this message is sent.
    .custom(async (classification_name) => {
      const classExists = await invModel.checkExistingClass(classification_name)
      console.log("man-validation: class Exists: ", classExists)
      if (classExists){
        throw new Error("This classification already exists.")
      }
    }),
  ]}

/* ******************************
 * Check data and return errors or continue to adding classification
 * ***************************** */
validate.checkClassData = async (req, res, next) => {
  const { classification_name } = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    console.log("errors at CheckClassData in man-validation: ", errors)
    res.render("inventory/add-classification", {
      errors,
      title: "Add Classification",
      nav,
      classification_name,
    })
    return
  }
  next()
}

module.exports = validate