const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please tell us your name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  photo: {
    type: String,
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Minimum length is 8 characters'],
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // it only works on SAVE and CREATE !!!
      validator: function (el) {
        return el === this.password;
      },
      message: 'You misspelled your password',
    },
  },
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // only runs the function if the password was modified

  this.password = await bcrypt.hash(this.password, 12); // encrypts the password, with cost of 12

  this.passwordConfirm = undefined; // we should not store the password confirmation !!
});

const User = mongoose.model('User', userSchema);

module.exports = User;
