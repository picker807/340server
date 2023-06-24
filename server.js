/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const env = require("dotenv").config()
const app = express()
const expressLayouts = require("express-ejs-layouts")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute.js")
const errorRoute = require("./routes/error.js")
const utilities = require("./utilities/")

/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.use(expressLayouts)
app.set("layout", "./layouts/layout") // not at views root

/* ***********************
 * Routes
 *************************/
app.use(require("./routes/static"))
//Index route
app.get("/", utilities.handleErrors(baseController.buildHome))
// Inventory routes
app.use("/inv", inventoryRoute)
// Intentional 500 error
app.use("/error", errorRoute)
// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Sorry, we appear to have lost that page, or it never existed.'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  console.log(err)
  let message
  if(err.status == 404 || err.status == 500){ 
    message = err.message
  } else if (!err.status) {
    err.status = 404,
    message = 'Sorry, we appear to have lost that page, or it never existed.'
  } else {message = 'Looks like you took a wrong turn!'}
  console.log(message)
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
