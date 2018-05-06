var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../User');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var Data = {};
router.use(function(req, resp, next){
	var userData = req.body;
	User.findOne({username: userData.username}, function(err, res){
		if(err){
			next(err);
		}
		if(res){
			resp.send('User Exists');
		}
		else {
			bcrypt.genSalt(10, function(err, salt) {
		    bcrypt.hash(userData.password, salt, function(err, hash) {
	        var num = [];
	        var newData = new User({
	        	username: userData.username,
	        	roleId: "2",
						password: hash,
						contactNumber: num.concat(userData.contact)
	        });
	        Data = {
		   			username:userData.username,
		   			password:hash,
		   			roleId:"2",
		   			contactNumber:num.concat(userData.contact)
		   		}
	        newData.save();
	        next();
		    });
			});
		}
	})
});

router.post('/',function(req, res, next){
	var token = jwt.sign(Data, 'iiiConsulting');
	res.cookie('access_token', token, {httpOnly: true}).status(301).redirect('/profile/' + req.body.username);
})

module.exports = router;