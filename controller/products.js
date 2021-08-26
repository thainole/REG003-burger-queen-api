const Product = require('../models/product');
const { pagination } = require('../helpers/helper');


// ------------------OBTENIENDO PRODUCTOS-------------------------
const getProducts = async (req, resp, next) => {

  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;

  try {
    const products = await Product.paginate({}, { limit, page });
    const url = `${req.protocol}://${req.get('host')}${req.path}`;
    const links = pagination(products, url, page, limit, products.totalPages);
    resp.links(links);
    if (!products.docs) {
      return next(404);
    }

    return resp.json(products.docs);

  } catch (error) {
    return next(error);
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
    return next(error);
  }
};


// -------------------CREANDO PRODUCTOS---------------------------
const postProduct = async (req, resp, next) => {

  try {
    const { name, price, image, type } = req.body;
    const product = new Product({ name, price, image, type });
  
    if (!name || !price) return next(400);
  
    product.dateEntry = new Date();
    
    // Guardar en database
    await product.save();
    resp.json(product);

  } catch (error) {
    return next(error);
  }


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
    return next(error);
  }
};


// -------------------EDITANDO PRODUCTOS--------------------------
const updateProduct = async (req, resp, next) => {
  try {

    const { name, price, image, type } = req.body;
    const { productId } = req.params;

    const productById = await Product.findById(productId);

    if (!productById) return next(404);

    if (typeof (price) !== 'number') return next(400);


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

    // Actualizando datos
    await Product.findByIdAndUpdate(productId, productById);
    resp.json(productById);

  } catch (error) {
    return next(error);
  }
};



module.exports = {
  getProducts,
  getProductById,
  postProduct,
  deleteProduct,
  updateProduct,
};
