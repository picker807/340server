const pool = require("../database/")

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
  try {
    const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
    return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Check for existing email
 * ********************* */
async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount

  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* *****************************
* Return account data using acount id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_firstname, account_lastname, account_email FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account ID found")
  }
}

/* *****************************
* Update account info
* ***************************** */
async function updateAccount (
  account_firstname, 
  account_lastname, 
  account_email,
  account_id) {
  try {
    const sql = `UPDATE public.account
  SET account_firstname = $1,
      account_lastname = $2,
      account_email = $3
  WHERE account_id = $4
  RETURNING *`

const updateAccount = await pool.query(sql, [
  account_firstname,
  account_lastname,
  account_email,
  account_id
]);  
    return updateAccount.rows[0]
  } catch (error) {
    return new Error("No matching account ID found")
  }
}

/* *****************************
* Update change password
* ***************************** */
async function changePassword (
  account_id,
  account_password) {
  try {
    const sql = `UPDATE public.account
  SET account_password = $1
  WHERE account_id = $2
  RETURNING *`

const changePassword = await pool.query(sql, [
  account_password,
  account_id
]);  
    return changePassword.rows[0]
  } catch (error) {
    return new Error("No matching account ID found")
  }
}

/* **********************
 *   Check Email by ID
 * ********************* */
async function checkEmailById(account_id, account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_id != $1 AND account_email = $2"
    const email = await pool.query(sql, [account_id, account_email])
    return email.rowCount

  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Get all reviews
 * ********************* */
async function getAllReviews(){
  try {
    const reviews = await pool.query("SELECT * FROM public.review ORDER BY review_id ASC ")
    return reviews.rows

  } catch (error) {
    return error.message
  }
}

/* **********************
 *   Get user review by ID
 * ********************* */
async function getReviewById(account_id){
  try {
    const sql = "SELECT * FROM public.review WHERE account_id = $1 "
    const review = await pool.query(sql, [account_id])
    return review.rows[0]

  } catch (error) {
    return error.message
  }
}

/* **********************
 *  Post review to DB
 * ********************* */
async function postReview(
  account_id, 
  review_name, 
  review_rating,
  review_text){
  try {
    const sql = `
      INSERT INTO public.review (account_id, review_name, review_rating, review_text)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (account_id)
      DO UPDATE SET review_name = $2, review_rating = $3, review_text = $4
      RETURNING *;`;
    const result = await pool.query(sql, [account_id, review_name, review_rating, review_text]);

    return result.rows[0]
  } catch (error) {
    return new Error("There was an error posting your review")
  }
}

module.exports = {registerAccount, checkExistingEmail, getAccountByEmail, 
  getAccountById, updateAccount, changePassword, checkEmailById, getAllReviews, getReviewById, postReview};