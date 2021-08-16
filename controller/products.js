const Product = require('../models/product');

// ------------------OBTENIENDO PRODUCTOS-------------------------
/* const getProducts = async (req, resp, next) => {
  try {
    
  } catch (error) {
    
  }
}; */


// ------------------OBTENIENDO PRODUCTOS POR ID-------------------------
/* const getProductById = async (req, resp, next) => {
  try {
    
  } catch (error) {
    
  }
}; */


// -------------------CREANDO PRODUCTOS---------------------------
const postProduct = async (req, resp, next) => {

  const { name, price, image, type } = req.body;
  const product = new Product({ name, price, image, type });

  if (!name || !price) return next(400);

  product.dateEntry = new Date();
  
  // Guardar en database
  await product.save();
  resp.json(product);
};


// -------------------BORRANDO PRODUCTOS--------------------------
const deleteProduct = async (req, resp, next) => {
  try {
    const { productId } = req.params;
    const productById = await Product.findByIdAndDelete(productId);

    if (!productById) {
      return next(404);
    }

    resp.json(productById);
  } catch (error) {
    return next(400);
  }
};


// -------------------EDITANDO PRODUCTOS--------------------------
/* const updateProduct = async (req, resp, next) => {
  try {
    
  } catch (error) {
    
  }
}; */


module.exports = {
  /* getProducts,
  getProductById, */
  postProduct,
  deleteProduct
  /* deleteProduct,
  updateProduct, */
};
