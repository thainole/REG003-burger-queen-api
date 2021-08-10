const User = require('../models/user');

/* Post admin User */
const postAdminUser = (adminUser, next ) => {
  const userFind = User.findOne({ email: adminUser.email });

  userFind.then((doc) => {
    if (doc) {
      console.info('El usuario ya existe en la base de datos');
      return next(200);
    }

    const newUser = new User(adminUser);
    newUser.save();
    console.info('El usuario ha sido creado');
  })
    .catch((err) => {
      if (err !== 200) {
        console.info('Ha ocurrido un error', err);
      }
    });
}

module.exports = {
  getUsers: (req, resp, next) => {
  },
  postAdminUser
};
