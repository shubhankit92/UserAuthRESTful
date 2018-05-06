var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');
var User = require('../User');
var roles = require('../role');
var jwt = require('jsonwebtoken');
var _ = require('underscore');
// var phone = require('phone');

function getCookie ( src, name ) {
  var value = "; " + src;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function phone (number){
	console.log('$$$$$$$$', number[0],number[1],number[2] )
	if(number[0]== "+" &&number[1]== "9" &&number[2]== "1" ){
		return false;
	}
	else {
		return true;
	}
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
      		var name;
      		if(obj.role=== 'ADMIN'){
      			name = req.params.username;
      		}
      		else {
      			name = decoded.username;
      		}

      		User.findOne({username: name}, async function(err, dbData){
      			var duplicate = _.find(dbData.contactNumber, function(num){
      				return _.find(req.body.contact, function(contact){
      					return contact === num;
      				})
      			});

      			var validPhone = _.find(req.body.contact, function(contact){
      				var val = phone(contact);
      				console.log('The val', val);
      				return val;
      				// console.log('The res is', resp);
      				// if(resp && resp.length>0){
      				// 	console.log('The ****');
      				// 	return false;
      				// }
      				// else if(resp || resp.length==0){
      				// 	console.log('The ))');
      				// 	return true;
      				// }
      			});

      			console.log('The ##########', validPhone);
      			console.log('The dups are::::', duplicate);
      			if(duplicate || validPhone){
      				res.status(417).send('Invalid records.');
      			}
      			else {

      			var newContactInfo = dbData.contactNumber.concat(req.body.contact);

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
			  		User.update({username: req.params.username}, {$set:{contactNumber:newContactInfo, roleId:obj.id}}, function(err, result){
							res.status(200).send('success');
			    	});
					}
					else {
						console.log('###');

						User.update({username: req.params.username}, {$set:{contactNumber:newContactInfo}}, function(err, result){
							res.status(200).send('success');
					});
					}

				}
				else if(decoded.username === req.params.username){
					User.update({username: decoded.username}, {$set:{contactNumber:newContactInfo}}, function(err, result){
							res.status(200).send('success');
					});
				}
				else 
					res.status(401).send('Not authorized.');
			}
	      
	      })
  			
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
