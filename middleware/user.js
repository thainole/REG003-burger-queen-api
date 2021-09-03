const { isValidEmail, isValidMongoId } = require('../helpers/helper');

module.exports.validUserId = (req, resp, next) => (
  (!isValidMongoId(req.params.uid) && !isValidEmail(req.params.uid))
    ? next(404)
    : next()
);
