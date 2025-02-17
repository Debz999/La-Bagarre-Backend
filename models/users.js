const mongoose = require('mongoose');

const addressSchema= mongoose.Schema({
number: String,
street: String,
city: String,
zipcode: String,
country: String
})


// const paymentSchema = mongoose.Schema({
//   name: String, 
//   cardNumber: Number, 
//   expirationDate: Date,
//   securityCode: String,
// });

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  token: String,
  firstname: String,
  lastname: String,
  address: [addressSchema],
  //payment: paymentSchema,
});

const User = mongoose.model('users', userSchema);

module.exports = User;