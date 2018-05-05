var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../User');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

router.use(function(req, resonse, next){
	var userData = req.body;

	User.findOne({username: userData.username}, function(err, res){
		console.log('The res is', res);

		if(err){
			resonse.error(err);
		}
		if(res){
			bcrypt.genSalt(10, function(err, salt) {
			    bcrypt.hash("B4c0/\/", salt, function(err, hash) {
				    var num = [];
				   	if(userData.password = hash){
				   		var obj = {
				   			username:res.username,
				   			password:res.password,
				   			roleId:res.roleId,
				   			contactNumber:res.contactNumber
				   		}
				   		var token = jwt.sign(obj, 'iiiConsulting');
						resonse.cookie('access_token', token, {httpOnly: true}).status(301).redirect('/profile/' + userData.username);

				   	}
				   	else {
				   		resonse.send('wrong password');
				   	}
			    });
			});
		}
		else {
			resonse.send('Invalid Username');
		}

	})

});

// router.post('/',function(req, res, next){
// 	res.redirect('/profile');
// })

module.exports = router;