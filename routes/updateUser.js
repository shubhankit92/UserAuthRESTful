var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../User');
var roles = require('../role');
var jwt = require('jsonwebtoken');
var _ = require('underscore');

function getCookie ( src, name ) {
  var value = "; " + src;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

router.use(function(req, res, next){
	var userData = req.body;
	var token = getCookie(req.headers.cookie, 'access_token');
  	jwt.verify(token, 'iiiConsulting', function(err, decoded) {
      if (err) {
        res.status(403).send('Not authenticated.');
      } else {
      	console.log('############', roles);
        next();
      }
    });
});
/* GET home page. */
router.post('/:username', function(req, res, next) {
  // console.log('The name', req.params.username)
  // if(decoded.role === 'ADMIN' || decoded.username === req.params.username){
  //     		next();
  //     	}
  // // res.render('/layout/' + req.params.username );
  // res.send('suzess');
	var token = getCookie(req.headers.cookie, 'access_token');
  	jwt.verify(token, 'iiiConsulting', function(err, decoded) {
      if (err) {
        res.status(403).send('Not authenticated.');
      } else {
      			var obj = _.find(roles,function(role){
      				return role.id===decoded.roleId;
      			});
      	if (obj.role=== 'ADMIN'){
      		console.log('#######', req.body);
      		if(req.body.makeAdmin){
      			var obj = _.find(roles,function(role){
      				return role.role==="ADMIN";
      			});
      			console.log('#');
	      		User.update({username: req.params.username}, {$set:{contactNumber:req.body.contact, roleId:obj.id}}, function(err, result){
	  				res.status(200).send('success');
	        	});
      		}
      		else {
      			console.log('###');

      			User.update({username: req.params.username}, {$set:{contactNumber:req.body.contact}}, function(err, result){
  					res.status(200).send('success');
        		});
      		}

      	}
        else if(decoded.username === req.params.username){
        	User.update({username: decoded.username}, {$set:{contactNumber:req.body.contact}}, function(err, result){
  				res.status(200).send('success');
        	});
      	}
      	else 
        res.status(401).send('Not authorized.');
      }
    });
});

router.delete('/:username', function(req, res, next) {
  // console.log('The name', req.params.username)
  // if(decoded.role === 'ADMIN' || decoded.username === req.params.username){
  //     		next();
  //     	}
  // // res.render('/layout/' + req.params.username );
  // res.send('suzess');
		console.log('&##########&&&&&&&&');

	var token = getCookie(req.headers.cookie, 'access_token');
  	jwt.verify(token, 'iiiConsulting', function(err, decoded) {
      if (err) {
        res.status(403).send('Not authenticated.');
      } else {
      	var obj = _.find(roles,function(role){
			return role.id===decoded.roleId;
		});
		console.log('&&&&&&&&&', obj);
        if((obj && obj.role === 'ADMIN') || decoded.username === req.params.username){
        	User.find({username: decoded.username}).remove(function(err, result){
  				// res.status(200).redirect('/login');
				res.clearCookie('access_token').status(200).send('successfuly deleted the user');

        	});
      	}
      	else 
        	res.status(401).send('Not authorized.');
      }
    });
});

module.exports = router;
