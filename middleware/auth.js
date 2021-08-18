/* eslint-disable no-nested-ternary */
const jwt = require('jsonwebtoken');

const Usuario = require('../models/user');


module.exports = (secret) => (req, resp, next) => {

  const { authorization } = req.headers;

  if (!authorization) {
    return next();
  }

  const [type, token] = authorization.split(' ');

  if (type.toLowerCase() !== 'bearer') {
    return next();
  }

  // DONE: Verificar identidad del usuario usando `decodeToken.uid`
  jwt.verify(token, secret, async (err, decodedToken) => {
    if (err) {
      return next(403);
    }
    const validUsuario = await Usuario.findOne({ _id: decodedToken.uid });
    try {
      if (!validUsuario) {
        return next(404);
      }
      req.authToken = decodedToken;
      return next();
    } catch (error) {
      return next(403);
    }
  });
};

// DONE: decidir por la informacion del request si la usuaria esta autenticada
module.exports.isAuthenticated = (req) => (!!req.authToken);

// DONE: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => (!!req.authToken.roles.admin);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);
  
module.exports.requireUser = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!req.authToken.roles.admin && req.params.uid !== req.authToken.uid && req.params.uid !== req.authToken.email)
      ? next(403)
      : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
