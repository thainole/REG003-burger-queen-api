const { ObjectId } = require('mongoose').Types;

module.exports.isValidMongoId = (id) => {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};

module.exports.validOrderId = (req, resp, next) => (
  (!module.exports.isValidMongoId(req.params.orderId))
    ? next(404)
    : next()
);

