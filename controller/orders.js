const Order = require('../models/order');


// --------------POST ORDERS ----------------
const postOrder = async (req, resp, next) => {

  try {
    const { userId, client, products } = req.body;
    console.log(userId, client, products);
    const order = new Order({ userId,
      client,
      products: products.map((product) => ({
        qty: product.qty,
        product: product._id
      })) });


    if (!userId || !products || !client || products.length === 0) return next(400);


    console.log(order);

    // if(req.authToken.uid !== userId) return next(400); // opcional

    /* order.products = products.map((product) => ({
      qty: product.qty,
      product: product._id
    })); */

    await order.save();

  
    const completeOrder = await order
      .findOne({ userId: req.authToken.uid })
      .populate({
        path: 'product', // populate blogs
      })
      .execPopulate();
  
    console.log(completeOrder);
    await order.save();
    
    return resp.json(completeOrder);

  } catch (error) {
    return next(error);
  }
};

module.exports = {
  postOrder
};
