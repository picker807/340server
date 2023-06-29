const errorController = {}

// Generate intentional error
errorController.triggerError = async (req, res, next) => {
  const error = new Error("Internal Service Error")
  error.status = 500
  throw error
};

module.exports = errorController