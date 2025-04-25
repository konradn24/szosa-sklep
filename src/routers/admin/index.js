const express = require('express');

const products = require('./products');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('admin/index', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart
    });
});

router.use('/produkty', products)

module.exports = router;