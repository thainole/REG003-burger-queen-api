const bcrypt = require('bcrypt');
const User = require('../models/user');

const { isValidEmail } = require('../helpers/helper');


// ---------------------CREANDO ADMIN---------------------------
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

// ------------------OBTENIENDO USUARIOS-------------------------
const getUsers = async (req, resp, next) => {

  const {limit = 10} = req.query;
  try {
    const users = await User.find()
      .limit(Number(limit))

    if (!users) {
      return next(404);
    }
    resp.json(users);
  } catch (error) {
    return next(400);
  }
};

// ------------------OBTENIENDO USUARIOS BY ID-------------------------
const getUserId = async (req, resp, next) => {

  try {
    const { uid } = req.params;
    let userById = isValidEmail(uid) ? await User.findOne({email:uid}) : await User.findById(uid)

    if (!userById) {
      return next(404);
    }

    resp.json(userById);

  } catch (error) {
    return next(400);
  }
};


// -------------------CREANDO USUARIOS---------------------------
const postUsers = async (req, resp, next) => {

  const { email, password, roles } = req.body;
  const user = new User({ email, password, roles });

  // Verificamos si mandan correo y contraseña
  if (!email || !password) return next(400);

  // Verificamos si el email es válido
  if (!isValidEmail(email)) return next(400);
  
  // Verificamos que la contraseña sea válida
  if (password.length < 4) return next(400);

  // Verificamos si el correo existe
  const existingEmail = await User.findOne({ email });
  if (existingEmail) return next(403);

  // Encriptando contraseña
  const salt = bcrypt.genSaltSync();
  user.password = bcrypt.hashSync(password, salt);

  // Guardar en database
  await user.save();
  resp.json(user);
};

// ------------------DELETE USUARIOS-------------------------
const deleteUser = async (req, resp, next) => {

  try {

    const { uid } = req.params;
    let userById = isValidEmail(uid) ? await User.findOneAndDelete({email:uid}) : await User.findByIdAndDelete(uid);

    if (!userById) {
      return next(404);
    }

    resp.json(userById);

  } catch (error) {
    return next(400);
  }
};

// ------------------PUT USUARIOS-------------------------
const updateUser = async (req, resp, next) => {
  try {
    const { email, password, roles } = req.body;
    const { uid } = req.params;
    const user = { email, password, roles };

    if (!email || !password) return next(400);

    if (!isValidEmail(email)) return next(400);

    if (password.length < 6) return next(400);

    if (password) {
      
      const salt = bcrypt.genSaltSync();
      user.password = bcrypt.hashSync(password, salt);
    }

    const userUpdate = await User.findByIdAndUpdate(uid, user);

    if (!userUpdate) return next(403);

    resp.json(userUpdate);

  } catch (error) {
    return next(400);
  }

};


module.exports = {
  getUsers,
  postAdminUser,
  postUsers,
  getUserId,
  deleteUser,
  updateUser,
};
