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

module.exports.pagination = (response, url, page, limit, totalPages) => {
  const linkHeader = {
    first: `${url}?limit=${limit}&page=1`,
    prev: response.hasPrevPage ? `${url}?limit=${limit}&page=${page - 1}` : `${url}?limit=${limit}&page=${page}`,
    next: response.hasNextPage ? `${url}?limit=${limit}&page=${page + 1}` : `${url}?limit=${limit}&page=${page}`,
    last: `${url}?limit=${limit}&page=${totalPages}`,
  };

  return linkHeader;
};
