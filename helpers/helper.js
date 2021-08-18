module.exports.isValidEmail = (email) => {
  const regexp = new RegExp('^[^@]+@[^@]+\\.[a-zA-Z]{2,}$');
  return regexp.test(email);
};
