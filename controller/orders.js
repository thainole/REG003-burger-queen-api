const Order = require('../models/order');
const { pagination } = require('../helpers/helper');


// --------------POST ORDERS ----------------
const postOrder = async (req, resp, next) => {

  try {
    const { userId, client, products } = req.body;

    if (!userId || !client || !products || products.length === 0) return next(400);
    
    const newOrder = new Order({
      userId, 
      client, 
      products: products.map((product) => ({
        qty: product.qty,
        product: product.productId
      }))
    });

    // Guardar en database
    await newOrder.save();
    
    const completeOrder = await newOrder.populate('products.product')
      .execPopulate();

    return resp.json(completeOrder);

  } catch (error) {
    return next(error);
  }
};


// --------------GET ORDERS ----------------
const getOrders = async (req, resp, next) => {

  const limit = parseInt(req.query.limit, 10) || 10;
  const page = parseInt(req.query.page, 10) || 1;

  try {
    const orders = await Order.paginate({}, { limit, page });
   
    const url = `${req.protocol}://${req.get('host')}${req.path}`;

    const links = pagination(orders, url, page, limit, orders.totalPages);

    resp.links(links);

    if (!orders) {
      return next(404);
    }
    
    return resp.json(orders.docs);

  } catch (error) {
    return next(error);
  }

};


// --------------GET ORDER ID ----------------
const getOrderById = async (req, resp, next) => {

  try {
    const { orderId } = req.params;
    const orderById = await Order.findById(orderId);
    if (!orderById) {
      return next(404);
    }
    const order = await orderById.populate('products.product')
      .execPopulate();

    resp.json(order);

  } catch (error) {
    return next(error);
  }
};

// --------------PUT ORDER ID ----------------
const updateOrder = async(req, resp, next) => {

  try {

    const { userId, client, products, status } = req.body;
    const { orderId } = req.params;

    const orderById = await Order.findById(orderId);
    
    if(!orderById) return next(404);

    if(!userId && !client && !products && !status) return next(400);

    if(orderById.status === status && orderById.userId === userId
      && orderById.products === products && orderById.client === client) return next(400)
    
    if (userId) {
      orderById.userId = userId;
    }
    if (client) {
      orderById.client = client;
    }
    if (products) {
      orderById.products = products;
    }
    if (status) {
      orderById.status = status;
    }
    
    console.log('lineaa118')

    const statusOrder = [
      'pending',
      'canceled',
      'delivering',
      'delivered',
      'preparing',
    ];
    if (status && !statusOrder.includes(status)) return next(400);

    await Order.findByIdAndUpdate(orderId, orderById);

    return resp.json(orderById);
  } catch (error) {
    return next(error);
  }
}


// --------------DELETE ORDERS ----------------
const deleteOrder = async (req, resp, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) return next(404);
    
    const orderById = await Order.findByIdAndDelete(orderId);
    
    resp.json(orderById);
    
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  postOrder,
  deleteOrder,
  getOrders,
  getOrderById,
  updateOrder
};
