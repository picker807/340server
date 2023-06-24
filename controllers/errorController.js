const errorController = {}

// Generate intentional error
errorController.triggerError = async (req, res, next) => {
  next({status: 500, message: 'Internal Service Error'})
  //throw new Error('Intentional error occurred!');
};

module.exports = errorController