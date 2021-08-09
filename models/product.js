const { Schema, model } = require('mongoose');

const productSchema = new Schema({
  _id: {
    type: Number,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
  },
  type: {
    type: String,
  },
  dateEntry: {
    type: Date,
  },

});

module.exports = model('product', productSchema);
