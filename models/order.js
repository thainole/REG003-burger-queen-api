const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

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
    // required: true,
  },
  dateProcessed: {
    type: Date,
    default: Date.now,
    // required: true,
  },
});

orderSchema.plugin(mongoosePaginate);

module.exports = model('Order', orderSchema);
