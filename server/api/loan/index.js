'use strict';

var express = require('express');
var controller = require('./loan.controller');

var jwt=require('express-jwt');
var jwtConfig=require('../jwtConfig');
var secret=jwtConfig.getSecret();

var router = express.Router();

router.get('/',jwt({secret:secret}), controller.index);
router.get('/:id', controller.show);
router.post('/', controller.create);
router.put('/:id', controller.update);
router.patch('/:id', controller.update);
router.delete('/:id', controller.destroy);

module.exports = router;
