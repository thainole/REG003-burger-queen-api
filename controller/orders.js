const Order = require('../models/order');


// --------------POST ORDERS ----------------
const postOrder = async (req, resp, next) => {

  try {
    const { userId, client, products } = req.body;

    if (!userId || !client || !products || products.length === 0) return next(400);

    
    const newOrder = new Order({
      userId, 
      client, 
      products
    });

    // Guardar en database
    await newOrder.save();
    
    const completeOrder = await newOrder.populate('products.product')
      .execPopulate();

    return resp.json(completeOrder);

  } catch (error) {
    return next(500);
  }
};

// --------------GET ORDERS ----------------
const getOrders = async (req, resp, next) => {
  const { limit = 10 } = req.query;

  try {
    const orders = await Order.find()
      .limit(Number(limit));

    if (!orders) return next(404);
    console.log(orders);
    return resp.json(orders);
  } catch (error) {
    return next(500);
  }

};

// --------------GET ORDER ID ----------------
const getOrderById = async (req, resp, next) => {
  
  try {
    const { orderId } = req.params;
    const orderById = await Order.findById(orderId);
    
    if (!orderById) return next(404);

    resp.json(orderById);

  } catch (error) {
    return next(500);
  }
};


// --------------DELETE ORDERS ----------------
const deleteOrder = async (req, resp, next) => {
  try {
    const { orderId } = req.params;

    if (!orderId) return next(404);
    
    const orderById = await Order.findByIdAndDelete(orderId);
    
    resp.json(orderById);
    
  } catch (error) {
    return next(500);
  }
};

module.exports = {
  postOrder,
  deleteOrder,
  getOrders,
  getOrderById
};
