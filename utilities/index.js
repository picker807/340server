const invModel = require("../models/inventory-model")
const jwt = require("jsonwebtoken")
require("dotenv").config()
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}

/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/* **************************************
* Build the individual vehicle view HTML
* ************************************ */
Util.buildInventoryDisplay = async function (info) {
  let display
  const data = info[0]
  const formatter = new Intl.NumberFormat('en-US')
  if (data) {
    display = `
    <div class="car-details">
      <div class="car-image">
        <img src="${data.inv_image}" alt="Car Image">
      </div>
      <div class="car-info">
        <h2 id="car-title">${data.inv_year} ${data.inv_make} ${data.inv_model}</h2>
        <h2 id="car-price">$${formatter.format(data.inv_price)}</h2>
        <p><span class="car-info-label">Mileage:</span> <span id="car-miles">${formatter.format(data.inv_miles)}</span></p>
        <p><span class="car-info-label">Color:</span> <span id="car-color">${data.inv_color}</span></p>
        <p><span class="car-info-label">Description:</span> <span id="car-description">${data.inv_description}</span></p>
      </div>
    </div>
    `
  } else {
    display = '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return display
}
/* **************************************
* Build the classification list for adding inventory
* ************************************ */
Util.getClassOptions = async function(class_id = '') {
  const classifications = await invModel.getClassifications();
  if (classifications) {
    let display = `<option value="">Select a classification</option>`;
    classifications.rows.forEach(classification => {
      const isSelected = classification.classification_id === class_id ? 'selected' : '';
      display += `<option value="${classification.classification_id}" ${isSelected}>${classification.classification_name}</option>`;
    });

    return display;
  }
};

/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

// intentional 500 error
Util.catchErrors = (err, req, res, next) => {
  res.redirect('/error');
};

/* ****************************************
* Middleware to check token validity
**************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
   jwt.verify(
    req.cookies.jwt,
    process.env.ACCESS_TOKEN_SECRET,
    function (err, accountData) {
     if (err) {
      req.flash("Please log in")
      res.clearCookie("jwt")
      return res.redirect("/account/login")
     }
     res.locals.account_id = accountData.account_id
     res.locals.accountFirstName = accountData.account_firstname
     res.locals.accountLastName = accountData.account_lastname
     res.locals.account_email = accountData.account_email
     res.locals.account_type = accountData.account_type
     res.locals.loggedIn = 1
     next()
    })
  } else {
   next()
  }
 }

 /* ****************************************
 *  Check Login
 * ************************************ */
 Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedIn) {
    next()
  } else {
    req.flash("notice", "Please log in.")
    return res.redirect("/account/login")
  }
 }

 /* ****************************************
 *  Check Account Type
 * ************************************ */
 Util.checkAccountType = (req, res, next) => {
  const type = res.locals.account_type
  if (type == "Admin" || type == "Employee") {
    next()
  } else {
    req.flash("notice", "You are not authorized to view that page.")
    return res.redirect("/account/login")
  }
 }

/* ****************************************
 *  Build Reviews Table
 * ************************************ */
Util.buildReviewGrid = async function (data) {
  let grid;
  if (data.length > 0) {
    grid = '<ul id="review-display">';
    data.forEach(review => {
      grid += `<li class="review-item">
        <div id="review-name">${review.review_name}</div><br>
        <div class="rating">`;
    
        for (let i = 1; i <= 5; i++) {
          grid += `<div class="rating" data-review-id="${review.review_id}">`;
          grid += `
            <input type="radio" id="rating${i}-${review.review_id}" name="review_rating-${review.review_id}" value="${i}" ${review.review_rating === i ? 'checked' : ''} hidden>
            <label for="rating${i}-${review.review_id}" class="star ${i <= review.review_rating ? 'highlight' : ''}">&#9733;</label>`;
          grid += `</div>`;
        }
      grid += `
      <div id="review-text">${review.review_text}</div>
      </li>`
    })
    
      
      grid += '</ul>';
  } else {
    grid = '<p class="notice">There are no reviews</p>';
  }
  return grid;
}

module.exports = Util