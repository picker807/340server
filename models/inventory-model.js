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
    console.log("classification: ", classification.rowCount)
    return classification.rowCount
  } catch (error) {
    return error.message
  }
}

module.exports = {getClassifications, getInventoryByClassificationId, getInventoryByInventoryId, addClassification, checkExistingClass };