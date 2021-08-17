const Product = require('../models/product');

// ------------------OBTENIENDO PRODUCTOS-------------------------
const getProducts = async (req, resp, next) => {

  const { limit = 10 } = req.query;

  try {
    const products = await Product.find()
      .limit(Number(limit));

    if (!products) {
      return next(404);
    }
    resp.json(products);
  } catch (error) {
    return next(400);
  }
};


// ------------------OBTENIENDO PRODUCTOS POR ID-------------------------
const getProductById = async (req, resp, next) => {

  try {
    const { productId } = req.params;
    const productById = await Product.findById(productId);

    if (!productById) {
      return next(404);
    }
    resp.json(productById);

  } catch (error) {
    return next(400);
  }
};


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
const updateProduct = async (req, resp, next) => {
  
  try {
    const { name, price, image, type } = req.body;
    const { productId } = req.params;
    // const product = {name, price, image, type}
    
    const productById = await Product.findById(productId);

    if (!name || !price) return next(400);

    if (!productById) return next(404);

    if (productById.name === name && productById.price === price 
      && productById.image === image && productById.type === type) {
      return next(400);
    }

    if (name) {
      productById.name = name;
    }
    if (price) {
      productById.price = price;
    }
    if (image) {
      productById.image = image;
    }
    if (type) {
      productById.type = type;
    }

    const { _id, __v, dateEntry, ...product } = productById;
    const productUpdate = await Product.findByIdAndUpdate(productId, product);

    resp.json(productUpdate);
    
  } catch (error) {
    return next(400);
  }
};


module.exports = {
  getProducts,
  getProductById, 
  postProduct,
  deleteProduct,
  updateProduct,
};
