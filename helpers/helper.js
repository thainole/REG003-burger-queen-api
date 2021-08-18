const { ObjectId } = require('mongoose').Types;

module.exports.isValidEmail = (email) => {
  const regexp = new RegExp('^[^@]+@[^@]+\\.[a-zA-Z]{2,}$');
  return regexp.test(email);
};

module.exports.isValidMongoId = (id) => {
  if (ObjectId.isValid(id)) {
    if ((String)(new ObjectId(id)) === id) return true;
    return false;
  }
  return false;
};
