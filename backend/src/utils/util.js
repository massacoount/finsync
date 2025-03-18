const { validationResult } = require("express-validator");

class Util {
  constructor(logger) {
    this.logger = logger;
  }
  validateRequest() {
    return (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        this.logger.debug("Request is rejected with errors", errors);
        return res.status(400).json({ errors: errors.array() });
      }
      return next();
    };
  }
}
module.exports = Util;
