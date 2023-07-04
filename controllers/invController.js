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
 * Build inventory Management
 * ************************ */
invCont.buildManagement = async function (req, res) {
  let nav = await utilities.getNav()
  const classificationList = await utilities.getClassOptions(class_id = '')
  res.render("inventory/management", {
    title: "Inventory Management",
    nav,
    errors: null,
    classificationList,
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
 * Deliver add inventory form view
 * ************************ */
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classifications = await utilities.getClassOptions(class_id = '')
  console.log(classifications)
  res.render("inventory/add-inventory", {
    title: "Add Inventory",
    nav,
    errors: null,
    classifications,
  })
}
/* *************************
 * Process add classification
 * ************************ */
invCont.addClassification = async (req, res) => {

  const { classification_name } = req.body;

  const classResult = await invModel.addClassification(classification_name);
  console.log("result of adding class to DB: ", classResult)
  if (classResult) {
   // consol.log("classResult is true, generating message class added")
    req.flash(
      "notice",
      `New classification, ${classification_name}, added.`
    );
    let nav = await utilities.getNav();
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors:null,
    })
  } else {
    console.log("classResult is false, should get some errors")
    req.flash("notice", "Sorry, there was a problem adding the new classification.");
    let nav = await utilities.getNav();
    res.status(501).render("inventory/add-classification", {
      title: "Add Classification",
      nav,
      errors: null,
      classification_name,
    });
  }
};

/* *************************
 * Process add inventory
 * ************************ */
invCont.addNewInventory = async (req, res) => {

  const { 
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color } = req.body;

  const invResult = await invModel.addInventory(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
    );

  console.log("result of adding inventory to DB: ", invResult)
  if (invResult) {
   
    req.flash(
      "notice",
      `New inventory, ${inv_make} ${inv_model}, added.`
    );
    let nav = await utilities.getNav();
    let classificationList = await utilities.getClassOptions(class_id = '')
    res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      errors:null,
      classificationList
    })
  } else {
    console.log("invResult is false, should get some errors")
    req.flash("notice", "Sorry, there was a problem adding the new inventory.");
    let nav = await utilities.getNav();
    let classifications = await utilities.getClassOptions(classification_id)
  
    res.status(501).render("inventory/add-inventory", {
      title: "Add Inventory",
      nav,
      errors: null,
      classifications,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.buildEditInventory = async function (req, res, next) {
  const inv_id = parseInt(req.params.inv_id)
  let nav = await utilities.getNav()
  let itemData = await invModel.getInventoryByInventoryId(inv_id)
  itemData = itemData[0]
  const classificationSelect = await utilities.getClassOptions(itemData.classification_id)

  const itemName = `${itemData.inv_make} ${itemData.inv_model}`
  res.render("./inventory/edit-inventory", {
    title: "Edit " + itemName,
    nav,
    classifications: classificationSelect,
    errors: null,
    inv_id: itemData.inv_id,
    inv_make: itemData.inv_make,
    inv_model: itemData.inv_model,
    inv_year: itemData.inv_year,
    inv_description: itemData.inv_description,
    inv_image: itemData.inv_image,
    inv_thumbnail: itemData.inv_thumbnail,
    inv_price: itemData.inv_price,
    inv_miles: itemData.inv_miles,
    inv_color: itemData.inv_color,
    classification_id: itemData.classification_id
  })
}

/* *************************
 * Update Inventory Data
 * ************************ */
invCont.updateInventory = async (req, res) => {

  const { 
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
    inv_id } = req.body;

  const updateResult = await invModel.updateInventory(
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
    );

  if (updateResult) {
   
    req.flash(
      "notice",
      `The ${inv_make} ${inv_model} was successfully updated.`
    )
    res.redirect("/inv/")
  } else {
    console.log("invResult is false, should get some errors")
    req.flash("notice", "Sorry, there was a problem adding the new inventory.");
    let nav = await utilities.getNav();
    let classifications = await utilities.getClassOptions(classification_id)
    const itemName = `${inv_make} ${inv_model}`
  
    res.status(501).render("inventory/add-inventory", {
      title: "Edit " + itemName,
      nav,
      errors: null,
      classifications,
      inv_id,
      inv_make,
      inv_model,
      inv_year,
      inv_description,
      inv_image,
      inv_thumbnail,
      inv_price,
      inv_miles,
      inv_color,
      classification_id,
    });
  }
};

module.exports = invCont