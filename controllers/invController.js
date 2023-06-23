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
  console.log(inv_id)
  const data = await invModel.getInventoryByInventoryId(inv_id)
  console.log(data)
  const display = await utilities.buildInventoryDisplay(data)
  let nav = await utilities.getNav()
  res.render("./inventory/vehicle", {
    title: `${data[0].inv_make} ${data[0].inv_model}`,
    nav,
    display
  })

}

module.exports = invCont