const bcrypt = require('bcrypt');
const User = require('../models/user');
const { isValidEmail, pagination } = require('../helpers/helper');
const { isAdmin } = require('../middleware/auth');


// ---------------------CREANDO ADMIN---------------------------
const postAdminUser = async (adminUser, next) => {
  try {
    const userFind = await User.findOne({ email: adminUser.email });
    if (userFind !== null) {
      return next(200);
    }

    const newUser = new User(adminUser);
    await newUser.save();
    console.info('El usuario ha sido creado');

  } catch (error) {
    if (error !== 200) return error;
  }

};


// ------------------OBTENIENDO USUARIOS-------------------------
const getUsers = async (req, resp, next) => {

  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;

  try {
    const users = await User.paginate({}, { limit, page });

    const url = `${req.protocol}://${req.get('host')}${req.path}`;

    const links = pagination(users, url, page, limit, users.totalPages);

    resp.links(links);

    if (!users) {
      return next(404);
    }

    return resp.json(users.docs);

  } catch (error) {
    return next(error);
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

    return resp.json(userById);

  } catch (error) {
    return next(error);
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
    return resp.json(user);

  } catch (error) {
    return next(error);
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

    return resp.json(userById);

  } catch (error) {
    return next(error);
  }
};


// ------------------PUT USUARIOS-------------------------
const updateUser = async (req, resp, next) => {

  try {
    const { uid } = req.params;

    const userById = isValidEmail(uid)
      ? await User.findOne({ email: uid })
      : await User.findById(uid);
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
    return resp.json(userById);

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
