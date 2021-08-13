const User = require('../models/user');
const { isValidEmail } = require('../helpers/helper');
const bcrypt = require('bcrypt');

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
const getUserId = async(req, resp, next) => {

  try {
    const {uid} = req.params;
    const userId = await User.findById(uid);
  
    if(!userId){
      return resp.status(404).json({
        message: 'User Not Exist',
      });
    };
  
    resp.json({userId})

  } catch (error) {
      return resp.status(400).json({
        message: 'Bad request',
      });;
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
  if (password.length < 6) return next(400);

  // Verificamos si el correo existe
  const existingEmail = await User.findOne({ email });
  if (existingEmail) return next(403);

  // Encriptando contraseña
    user.password = bcrypt.hashSync(password, 10);

  // Guardar en database
  await user.save();
  resp.json({ user });
};



module.exports = {
  //getUsers,
  postAdminUser,
  postUsers,
  getUserId
};
