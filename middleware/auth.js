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
  // TODO: Verificar identidad del usuario usando `decodeToken.uid`
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
// TODO: decidir por la informacion del request si la usuaria esta autenticada
module.exports.isAuthenticated = (req) => (!!req.authToken);

// TODO: decidir por la informacion del request si la usuaria es admin
module.exports.isAdmin = (req) => (!!req.authToken.roles.admin);

module.exports.requireAuth = (req, resp, next) => (
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : next()
);

module.exports.requireAdmin = (req, resp, next) => (
  // eslint-disable-next-line no-nested-ternary
  (!module.exports.isAuthenticated(req))
    ? next(401)
    : (!module.exports.isAdmin(req))
      ? next(403)
      : next()
);
