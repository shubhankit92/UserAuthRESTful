var express = require('express');
var router = express.Router();
var createError = require('http-errors');

/* GET users listing. */
router.use(function(req, res, next){
	// console.log('The users router', req);
	// console.log('The users router', req.params);
	// if(req.params.id){
		// next();
	// }
	next(createError(401));


})
router.get('/:userId/userlist/:id', function(req, res, next) {
	console.log('******', req.params);

  res.send('respond with a resource');
});

router.post('/:userId/post/:id', function(req, res, next){
	console.log('******', req.params);
	res.send('the result');
})

module.exports = router;
