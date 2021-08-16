const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const config = require('../config');
const Usuario = require('../models/user');

const { secret } = config;

// DONE: autenticar a la usuarix

module.exports.authUsers = async (req, resp, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(400);
  }

  const validUsuario = await Usuario.findOne({ email });

  if (!validUsuario) {
    return resp.status(400).json({
      message: 'User Not Exist',
    });
  }

  const validPassword = bcrypt.compareSync(password, validUsuario.password);
  if (!validPassword) {
    return resp.status(400).json({
      msg: 'Usuario / Password no son correctos - password',
    });
  }

  jwt.sign(
    {
      uid: validUsuario._id,
      email: validUsuario.email,
      roles: validUsuario.roles,
    },
    secret,
    {
      expiresIn: '4h',
    },
    (err, token) => {
      if (err) console.error(err);

      return resp.status(200).json({ token });
    },
  );
};
