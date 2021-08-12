const User = require('../models/user');

/* Post admin User */
const postAdminUser = (adminUser, next) => {

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
};


// CREANDO USUARIOS
const postUsers = async (req, resp, next) => {

  const { email, password, roles } = req.body;
  const user = new User({ email, password, roles });

  // Verificamos si mandan correo y contraseña
  if (user.email === '' || user.password === '') {
    return next(400);
  }

  // Verificamos si el email es válido
  /* if (!user.email.isEmail()) {
    return next(400);
  } */

  // Verificamos si el correo existe
  const existingEmail = await User.findOne({ email });
  if (existingEmail) {
    return next(403);
  }

  // Guardar en database
  await user.save();
  resp.json({
    user,
  });
};



module.exports = {
  getUsers: (req, resp, next) => {
  },
  postAdminUser,
  postUsers
};
