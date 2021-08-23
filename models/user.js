const { Schema, model } = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    trim: true,
  },
  roles: {
    admin: {
      type: Boolean,
      default: false,
    },
  },

});

// eslint-disable-next-line func-names
userSchema.methods.toJSON = function () {
  const { __v, password, ...user } = this.toObject();
  return user;
};

userSchema.plugin(mongoosePaginate);

module.exports = model('User', userSchema);
