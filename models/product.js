const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const productSchema = new Schema({
  
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

// eslint-disable-next-line func-names
productSchema.methods.toJSON = function () {
  const { __v, ...product } = this.toObject();
  return product;
};

productSchema.plugin(mongoosePaginate);

module.exports = model('Product', productSchema);
