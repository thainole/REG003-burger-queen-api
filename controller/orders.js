const Order = require('../models/order');


// --------------POST ORDERS ----------------
const postOrder = async (req, resp, next) => {

  try {
    const {userId, client, products} = req.body;
    if(!userId && !products && !client) return next(400);

    if(products.length === 0) return next(400);

    if(req.authToken.uid !== userId) return next(400); // opcional

    const order = new Order({userId, client, products});
    
    //order.dateEntry = new Date;
    //order.status = pending;

    // Guardar en database
    await order.save();

    resp.json(order);
    console.log(order)

  } catch (error) {
    return next (400);
  }
}

module.exports = {
  postOrder
}