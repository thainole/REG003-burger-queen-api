const { isValidMongoId } = require('./orders');

module.exports.validProductId = (req, resp, next) => (
  (!isValidMongoId(req.params.productId))
    ? next(404)
    : next()
);
