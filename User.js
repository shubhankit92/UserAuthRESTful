var mongoose = require('mongoose');

var userSchema = new mongoose.Schema({
	username: String,
	password: String,
	contactNumber: Array,
	roleId: String
});

var User = mongoose.model('user', userSchema);
module.exports = User;