const { isValidMongoId } = require('../helpers/helper');

module.exports.validOrderId = (req, resp, next) => (
  (!isValidMongoId(req.params.orderId))
    ? next(404)
    : next()
);

