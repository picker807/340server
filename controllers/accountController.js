const utilities = require("../utilities/")
const accountModel = require("../models/account-model")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


/* ****************************************
*  Deliver login view
* *************************************** */
async function buildLogin(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/login", {
    title: "Login",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver registration view
* *************************************** */
async function buildRegister(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/register", {
    title: "Register",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver account view
* *************************************** */
async function buildAccount(req, res, next) {
  let nav = await utilities.getNav()
  res.render("account/", {
    title: "Account",
    nav,
    errors: null,
  })
}

/* ****************************************
*  Deliver Reviews view
* *************************************** */
async function buildReviews(req, res, next) {
  let nav = await utilities.getNav()
  const data = await accountModel.getAllReviews()
  const reviewGrid = await utilities.buildReviewGrid(data)
  res.render("account/review/", {
    title: "CSE Motors Reviews",
    nav,
    errors: null,
    reviewGrid,
  })
}

/* ****************************************
*  Deliver new review form
* *************************************** */
async function buildNewReview(req, res, next) {
  const account_id = res.locals.account_id
  console.log(account_id)
  //parseInt(req.params.account_id)
  let nav = await utilities.getNav()
  const reviewData = await accountModel.getReviewById(account_id)

  let review_name = "Anonymous";
  let review_rating = null;
  let review_text = null;

  if (reviewData) {
    review_name = reviewData.review_name;
    review_rating = reviewData.review_rating;
    review_text = reviewData.review_text;
  }

  const accountData = await accountModel.getAccountById(account_id)
  console.log(accountData)
  const userName = `${accountData.account_firstname} 
  ${accountData.account_lastname}`
  res.render("account/review/add-review", {
    title: `${userName}'s Review`,
    nav,
    errors: null,
    review_name,
    review_rating,
    review_text, 
    account_id
  })
}

/* ****************************************
*  Process New User Review
* *************************************** */
async function postReview(req, res) {
  const { account_id, review_name, review_rating, review_text } = req.body

  const reviewResult = await accountModel.postReview(
    account_id,
    review_name, 
    review_rating, 
    review_text
  )

  if (reviewResult) {
    req.flash(
      "notice",
      `Your review has been posted.`)
    console.log("redirecting to reviews view")
    res.redirect("/account/review/")
    } else {
    req.flash("notice", "Sorry, something went wrong.")

    let nav = await utilities.getNav()
    const accountData = accountModel.getAccountById(account_id)
    const userName = `${accountData.account_firstname} 
    ${accountData.account_lastname}`

    res.render("account/review/new", {
    title: `${userName}'s Review`,
    nav,
    errors: null,
    review_name,
    review_rating,
    review_text
  })
  }
}

/* ****************************************
*  Process New Registration
* *************************************** */
async function registerAccount(req, res) {
  let nav = await utilities.getNav()
  const { account_firstname, account_lastname, account_email, account_password } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error processing the registration.')
    res.status(500).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }

  const regResult = await accountModel.registerAccount(
    account_firstname,
    account_lastname,
    account_email,
    hashedPassword
  )

  if (regResult) {
    req.flash(
      "notice",
      `Congratulations, you\'re registered ${account_firstname}. Please log in.`
    )
    res.status(201).render("account/login", {
      title: "Login",
      nav,
      errors: null,
    })
  } else {
    req.flash("notice", "Sorry, the registration failed.")
    res.status(501).render("account/register", {
      title: "Registration",
      nav,
      errors: null,
    })
  }
}

/* ****************************************
 *  Process login request
 * ************************************ */
async function accountLogin(req, res) {
  let nav = await utilities.getNav()
  const { account_email, account_password } = req.body
  const accountData = await accountModel.getAccountByEmail(account_email)
  if (!accountData) {
   req.flash("notice", "Please check your credentials and try again.")
   res.status(400).render("account/login", {
    title: "Login",
    nav,
    errors: null,
    account_email,
   })
  return
  }
  try {
   if (await bcrypt.compare(account_password, accountData.account_password)) {
    console.log("passwords match")
   delete accountData.account_password
   const accessToken = jwt.sign(accountData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
   res.cookie("jwt", accessToken, { httpOnly: true, maxAge: 3600 * 1000 })
   return res.redirect("/account/")
   } else {
    req.flash("notice", "Invalid email or password");
    return res.redirect("/account/login");
   }
  } catch (error) {
   return new Error('Access Forbidden')
  }
 }

/* ****************************************
*  Deliver account update view
* *************************************** */

async function buildUpdateAccount (req, res, next) {
  const account_id = parseInt(req.params.account_id)

  let nav = await utilities.getNav()
  let accountData = await accountModel.getAccountById(account_id)
  const itemName = `${accountData.account_firstname} ${accountData.account_lastname}`
  console.log("building account update view")
  res.render("./account/update", {
    title: "Update account for " + itemName,
    nav,
    errors: null,
    account_id: account_id,
    account_firstname: accountData.account_firstname,
    account_lastname: accountData.account_lastname,
    account_email: accountData.account_email,
  })
}

/* ****************************************
*  Process account update
* *************************************** */
async function updateAccount (req, res, next) {

  const { account_firstname, account_lastname, account_email, account_id } = req.body
console.log("Process update: ", account_firstname, account_lastname, account_email, account_id)
  const updateResult = await accountModel.updateAccount(
    account_firstname,
    account_lastname,
    account_email,
    account_id
  )

  if (updateResult) {
    console.log(updateResult)
    const updatedProfile = {
      account_firstname: updateResult.account_firstname,
      account_lastname: updateResult.account_lastname,
      account_email: updateResult.account_email,
      account_id: account_id,
      account_type: updateResult.account_type
    };
    const newToken = jwt.sign(updatedProfile, process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 * 1000 })
    // Update the JWT cookie
    res.cookie('jwt', newToken);

    req.flash(
      "notice",
      "Account data successfully updated. <br>First name: "
      +updateResult.account_firstname
      +"<br>Last name: "
      +updateResult.account_lastname
      +"<br>Email: "    
      +updateResult.account_email
    )
    res.redirect("/account/")

  } else {
    req.flash("notice", "Sorry, the update failed.")
    let nav = await utilities.getNav()
    const itemName = `${locals.accountFirstName} ${locals.accountLastName}`
    console.log(`${locals.accountFirstName} ${locals.accountLastName}`)
    res.status(501).render("./account/update", {
    title: "Update account for " + itemName,
    nav,
    errors: null,
    account_id: account_id,
    account_firstname: account_firstname,
    account_lastname: account_lastname,
    account_email: account_email,
    })
  }
} 


/* ****************************************
*  Process password update
* *************************************** */
async function updatePassword (req, res) {
  
  const { account_password, account_id } = req.body

  // Hash the password before storing
  let hashedPassword
  try {
    // regular password and cost (salt is generated automatically)
    hashedPassword = await bcrypt.hashSync(account_password, 10)
  } catch (error) {
    req.flash("notice", 'Sorry, there was an error updating the password.')
    res.status(500).redirect(`/account/update/${account_id}`)
  }

  const changeResult = await accountModel.changePassword(
    account_id,
    hashedPassword
  )
  if (changeResult) {
    req.flash(
      "notice",
      `Password updated`
    )
    res.status(201).redirect("/account/")
  } else {
    req.flash("notice", "Sorry, the password change failed.")
    res.status(501).redirect(`/account/update/${account_id}`)
  }
}

/* ****************************************
*  Logout the User
* *************************************** */
async function logoutUser (req, res) {
  try {
    console.log("trying to logout")
    res.clearCookie("jwt");
    res.locals.loggedIn = 0;
    res.redirect("/");
  } catch (error) {
    console.log(error)
  }
}
module.exports = { buildLogin, buildRegister, registerAccount, accountLogin, buildAccount, buildUpdateAccount, updateAccount, updatePassword, logoutUser, buildReviews, buildNewReview, postReview }