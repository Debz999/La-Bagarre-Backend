const mongoose = require('mongoose');

const adressSchema= mongoose.Schema({
number: String,
street: String,
city: String,
zipcode: String,
country: String
})

const userSchema = mongoose.Schema({
  username: String,
  password: String,
  email: String,
  token: String,
  firstname: String,
  lastname: String,
  adress: adressSchema,
 
});

const User = mongoose.model('users', userSchema);

module.exports = User;