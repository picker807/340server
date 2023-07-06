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

/*******************
 * Rules for new Inventory
 ********************/
validate.newInventoryRules = () => {
  return[
    //Check that classification name matches database
    body("classification_id")
    .trim()
    .custom(async (classification_id) => {
      let validClass = false
      let classifications = await invModel.getClassifications()
      classifications.rows.forEach(classification => {
        if (classification.classification_id == classification_id) {
          validClass = true
        }
      });
  
      if (!validClass) {
        console.log("class ID: ", classification_id)
        throw new Error("Classification is not valid")
      }
    })
    .withMessage("Select a classification"),
    
    // Rule for vehicle make
    body("inv_make")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Make must be 3 characters minimum"),

    //Rule for vehicle model
    body("inv_model")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Model must be 3 characters minimum"),

    //Rule for year
    body("inv_year")
    .trim()
    .isInt()
    .isLength({ min: 4, max: 4 })
    .withMessage('Year must be a 4-digit number'),

    //Rule for description
    body("inv_description")
    .trim()
    .isLength({ min: 3 })
    .withMessage("Add a description, min 3 characters"),
    
     //Rule for image
     body("inv_image")
     .matches(/^.*$/) // Matches any character sequence
     .isLength({min: 1})
     .withMessage('Invalid image path'),
 
     //rule for thumbnail
     body("inv_thumbnail")
     .matches(/^.*$/) // Matches any character sequence
     .isLength({min: 1})
     .withMessage('Invalid thumbnail path'),

    // Rule for price
    body("inv_price")
    .trim()
    .isNumeric()
    .withMessage('Price must be a valid number, no punctuation'),

    // Rule for miles
    body("inv_miles")
    .trim()
    .isNumeric()
    .withMessage('Miles must be a valid number, no punctuation'),
  
    //Rule for color
    body("inv_color")
    .trim()
    .isLength({min: 3})
    .withMessage("Color must be at least 3 characters"),
  ]
}



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

/* ******************************
 * Check data and return errors or continue to adding inventory
 * ***************************** */
validate.checkInvData = async (req, res, next) => {
  const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classifications = await utilities.getClassOptions(classification_id)
    res.render("inventory/add-inventory", {
      errors,
      title: "Add Inventory",
      nav,
      classifications,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
    })
    return
  }
  next()
}

/* ******************************
 * Check data and return to edit view or continue to updating inventory
 * ***************************** */
validate.checkUpdateData = async (req, res, next) => {
  const {classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, inv_id} = req.body
  let errors = []
  errors = validationResult(req)
  if (!errors.isEmpty()) {
    let nav = await utilities.getNav()
    let classifications = await utilities.getClassOptions(classification_id)
    const itemName = `${inv_make} ${inv_model}`
    res.render("inventory/edit-inventory", {
      errors,
      title: "Edit " + itemName,
      nav,
      classifications,
      classification_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      inv_id
    })
    return
  }
  next()
}

module.exports = validate