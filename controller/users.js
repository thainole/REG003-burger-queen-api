const bcrypt = require('bcrypt');
const User = require('../models/user');
const { isValidMongoId } = require('../middleware/products');

const { isValidEmail } = require('../helpers/helper');
const { isAdmin } = require('../middleware/auth');


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

  const { limit = 10 } = req.query;
  try {
    const users = await User.find()
      .limit(Number(limit));

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
    const userById = isValidEmail(uid)
      ? await User.findOne({ email: uid })
      : await User.findById(uid);

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

  try {
    const { email, password, roles } = req.body;
    const user = new User({ email, password, roles });

    if (!email || !password) return next(400);

    if (!isValidEmail(email)) return next(400);

    if (password.length < 4) return next(400);

    const existingEmail = await User.findOne({ email });
    if (existingEmail) return next(403);

    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    // Guardar en database
    await user.save();
    resp.json(user);

  } catch (error) {
    return next(400);
  }

};


// ------------------DELETE USUARIOS-------------------------
const deleteUser = async (req, resp, next) => {

  try {

    const { uid } = req.params;
    const userById = isValidEmail(uid)
      ? await User.findOneAndDelete({ email: uid })
      : await User.findByIdAndDelete(uid);

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
    const { uid } = req.params;
    // eslint-disable-next-line no-nested-ternary
    const userById = isValidEmail(uid)
      ? await User.findOne({ email: uid })
      : isValidMongoId(uid)
        ? await User.findById(uid)
        : '';
    if (!userById) return next(404);

    const { email, password, roles } = req.body;

    if (!isAdmin(req) && roles && roles.admin) return next(403);
    if (!password && !email) return next(400);

    const isEqualPassword = bcrypt.compareSync(password, userById.password);

    if (!isEqualPassword) {
      const salt = bcrypt.genSaltSync();
      userById.password = bcrypt.hashSync(password, salt);
    }
    if (!isAdmin(req)) {
      await User.findByIdAndUpdate(userById._id, userById);
    } else {

      if (email !== userById.email) {
        userById.email = email;
      }
      if (roles && roles.admin !== userById.roles.admin) {
        userById.roles.admin = roles.admin;
      }
      await User.findByIdAndUpdate(userById._id, userById);
    }
    resp.json(userById);

  } catch (error) {
    return next(error);
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
