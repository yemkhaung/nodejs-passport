var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
});

mongoose.model('UserModel', UserSchema );