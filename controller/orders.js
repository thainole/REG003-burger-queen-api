const Order = require('../models/order');


// --------------POST ORDERS ----------------
const postOrder = async (req, resp, next) => {

  try {
    const {userId, client, products} = req.body;

    if(!userId || !products || !client || products.length === 0) return next(400);

    //if(req.authToken.uid !== userId) return next(400); // opcional

    const order = new Order({
      userId, 
      client, 
      products: products.map(product => ({
        qty: product.qty,
        product: product._id
        })       
      )});

    //order.dateEntry = new Date;
    //order.status = pending;

    // Guardar en database
    const completeOrder = await order.populate(products.product)
    .execPopulate();
    await completeOrder.save();
    
    console.log(order)
    return resp.json(completeOrder);

  } catch (error) {
    return next (500);
  }
}

module.exports = {
  postOrder
}