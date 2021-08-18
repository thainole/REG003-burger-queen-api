const { ObjectId } = require('mongoose').Types;

module.exports.isValidMongoId = (id) => {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};

module.exports.validProductId = (req, resp, next) => (
  (!module.exports.isValidMongoId(req.params.productId))
    ? next(404)
    : next()
);
