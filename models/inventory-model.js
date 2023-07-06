const pool = require("../database/")

/* ***************************
 *  Get all classification data
 * ************************** */
async function getClassifications(){
  return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* ***************************
 *  Get all inventory items and classification_name by classification_id
 * ************************** */
async function getInventoryByClassificationId(classification_id) {
  try {
    const data = await pool.query(
      `SELECT * FROM public.inventory AS i 
      JOIN public.classification AS c 
      ON i.classification_id = c.classification_id 
      WHERE i.classification_id = $1`,
      [classification_id]
    )
    return data.rows
  } catch (error) {
    console.error("getclassificationsbyid error " + error)
  }
}

/* ***************************
 *  Get single inventory item from inv_id
 * ************************** */

async function getInventoryByInventoryId(inv_id) {
  try{
    const data = await pool.query(
      `SELECT * FROM public.inventory
      WHERE inventory.inv_id = $1`,
      [inv_id]
    )
    return data.rows
  } catch (error) {
    console.error("getinventorybyid error " + error)
  }
}

/* ***************************
 *  Add new classification to DB
 * ************************** */
async function addClassification (classification_name){
try{
  console.log("Started query to class DB")
  await pool.query(
    `INSERT INTO public.classification (classification_name)
    VALUES ($1)`,
    [classification_name]
  )
  return true
} catch (error) {
  console.error("addclassification error " + error)
}
}

/* ***************************
 *  Check for existing classification
 * ************************** */
async function checkExistingClass(classification_name){
  try {
    const sql = "SELECT * FROM classification WHERE classification_name = $1"
    const classification = await pool.query(sql, [classification_name])
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}
/* ***************************
 *  Add new Inventory item to the DB
 * ************************** */
async function addInventory(classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color) {
    try {
      const sql = `INSERT INTO public.inventory (classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color)
      VALUES (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10
        )`
      const addInv = await pool.query(sql, 
        [classification_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color])  
        
      return true
    } catch (error) {
      console.error("addinventory error " + error)
    }
  }

/* ***************************
*  Update Inventory item in the DB
* ************************** */
async function updateInventory(
  inv_id,
  classification_id,
  inv_make,
  inv_model,
  inv_year,
  inv_description,
  inv_image,
  inv_thumbnail,
  inv_price,
  inv_miles,
  inv_color) {
    
    try {
      console.log("updating in updateInventory()")
      const sql = `UPDATE public.inventory
  SET classification_id = $1,
      inv_make = $2,
      inv_model = $3,
      inv_year = $4,
      inv_description = $5,
      inv_image = $6,
      inv_thumbnail = $7,
      inv_price = $8,
      inv_miles = $9,
      inv_color = $10
  WHERE inv_id = $11
  RETURNING *`;

const updateInv = await pool.query(sql, [
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
]);  
    console.log(updateInv.rows[0])    
      return updateInv.rows[0]
    } catch (error) {
      console.error("model error " + error)
    }
  }

  /* ***************************
*  Delete Inventory item in the DB
* ************************** */
async function deleteInventory(inv_id) {
    
    try {
      const sql = `DELETE FROM inventory WHERE inv_id = $1`;
      const deleteInv = await pool.query(sql, [inv_id]);  
      return deleteInv
    } catch (error) {
      console.error("deletion error " + error)
    }
  }

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addClassification, checkExistingClass, addInventory, updateInventory, deleteInventory };