const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}
/* *************************
 * Build inventory by Inventory ID view
 * ************************ */
invCont.buildByInventoryId = async function (req, res) {
  const inv_id = req.params.inventoryId
  const data = await invModel.getInventoryByInventoryId(inv_id)
  const display = await utilities.buildInventoryDisplay(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle", {
    title: `${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    display
  })

}
/* *************************
 * Build inventory Mangement
 * ************************ */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("inventory/management", {
    title: "Inventory Management",
    nav
  })
}
/* *************************
 * Deliver add classification form view
 * ************************ */
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  console.log("rendering add class view")
  res.render("inventory/add-classification", {
    title: "Add Classification",
    nav,
    errors: null,
  })
}
/* *************************
 * Process add classification
 * ************************ */
invCont.addClassification = async (req, res) => {
  let nav = await utilities.getNav();
  const { classification_name } = req.body;

  const classResult = await invModel.addClassification(classification_name);
  console.log("result of adding class to DB: ", classResult)
  if (classResult) {
    consol.log("classResult is true, generating message class added")
    req.flash(
      "notice",
      `New classification, ${classification_name}, added.`
    );
  } else {
    console.log("classResult is false, should get some errors")
    req.flash("notice", "Sorry, there was a problem adding the new classification.");
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
    });
  }
};

module.exports = invCont