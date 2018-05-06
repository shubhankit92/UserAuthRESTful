var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../User');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');

router.use(function(req, resonse, next){
	var userData = req.body;
	User.findOne({username: userData.username}, function(err, resp){
		if(err){
			resonse.error(err);
		}
		if(resp){
			bcrypt.compare(userData.password, resp.password, function(err, res) {
		    var num = [];
		   	if(res){
		   		var obj = {
		   			username:resp.username,
		   			password:resp.password,
		   			roleId:resp.roleId,
		   			contactNumber:resp.contactNumber
		   		}
		   		var token = jwt.sign(obj, 'iiiConsulting');
					resonse.cookie('access_token', token, {httpOnly: true}).status(301).redirect('/profile/' + userData.username);
		   	}
		   	else {
		   		resonse.send('wrong password');
		   	}
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