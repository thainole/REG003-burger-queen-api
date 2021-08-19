const { Schema, model } = require('mongoose');
const { Product } = require('./product');

const orderSchema = new Schema({

  userId: {
    type: String,
    required: true,
  },
  client: {
    type: String,
    required: true,
  },
  products: [{
    qty: {
      type: Number,
      required: true,
    },
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
  }],
  status: {
    type: String,
    default: 'pending',
  },
  dateEntry: {
    type: Date,
    default: Date.now,
    required: true,
  },
  dateProcessed: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

// eslint-disable-next-line func-names
orderSchema.methods.toJSON = function () {
  const { __v, ...order } = this.toObject();
  return order;
};


module.exports = model('Order', orderSchema);
