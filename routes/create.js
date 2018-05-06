var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../User');
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var Data = {};
var _ = require('underscore');

function phone (number){
	if(number[0]== "+" &&number[1]== "9" &&number[2]== "1" ){
		return false;
	}
	else {
		return true;
	}
}

router.use(function(req, resp, next){
	var num = [];
	var userData = req.body;
	User.findOne({username: userData.username}, function(err, res){
		if(err){
			next(err);
		}
		if(res){
			resp.send('User Exists');
		}
		else {
			var nonValidPhone = _.find(num.concat(userData.contact), function(contact){
				var val = phone(contact);
				return val;
			});
			if(nonValidPhone){
				resp.status(417).send('Invalid Number');
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
		}
	})
});

router.post('/',function(req, res, next){
	var token = jwt.sign(Data, 'iiiConsulting');
	res.cookie('access_token', token, {httpOnly: true}).status(301).redirect('/profile/' + req.body.username);
})

module.exports = router;