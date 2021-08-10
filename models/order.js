const { Schema, model } = require('mongoose');

const orderSchema = new Schema({
  _id: {
    type: Number,
  },
  userId: {
    type: Number,
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
module.export = model('oders', orderSchema);
