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
        next();
      }
    });
});
/* GET home page. */
router.get('/:username', function(req, res, next) {
  // console.log('The name', req.params.username)
  // if(decoded.role === 'ADMIN' || decoded.username === req.params.username){
  //     		next();
  //     	}
  // // res.render('/layout/' + req.params.username );
  // res.send('suzess');
  var query = require('url').parse(req.url,true).query;
	var token = getCookie(req.headers.cookie, 'access_token');
  	jwt.verify(token, 'iiiConsulting', function(err, decoded) {
      if (err) {
        res.status(403).send('Not authenticated.');
      } else {
        var obj = _.find(roles,function(role){
          return role.id===decoded.roleId;
        });

        if(obj && obj.role === 'ADMIN' || decoded.username === req.params.username){
        	User.findOne({username: decoded.username}, function(err, result){
            if(query.page){
              res.send({pageNumber: query.page,MaxContactNumberPerpage: 10, contactDetails: result.contactNumber.slice((query.page-1)*10, (query.page-1)*10 + 10)});
            }
            else
              res.send({pageNumber: 1,MaxContactNumberPerpage: 10,contactDetails: result.contactNumber.slice(0, 10)});
        	});
      	}
      	else 
        res.status(401).send('Not authorized.');
      }
    });
});

module.exports = router;
