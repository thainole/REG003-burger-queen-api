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
    return next(404);
  }
  
  const validPassword = bcrypt.compareSync(password, validUsuario.password);
  if (!validPassword) {
    return next(400);
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
      return resp.json({ token });
    },
  );

};
