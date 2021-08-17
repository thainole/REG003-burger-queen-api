// const { getUidWithtoken } = require('../middleware/auth');

module.exports.isValidEmail = (email) => {
  const regexp = new RegExp('^[^@]+@[^@]+\\.[a-zA-Z]{2,}$');
  return regexp.test(email);
};

/* module.exports.isValidUser = async (uid) => {
  const resp = await getUidWithtoken();
  if (resp === uid) {
    console.log('okiiis');
  } else {
    console.log('getUidWithtoken:', resp);
    console.log('UID:', uid);
    throw new Error();
  }
}; */
