const express = require('express');

const products = require('./products');
const users = require('./users');
const orders = require('./orders');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('admin/index', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart
    });
});

router.use('/produkty', products);
router.use('/konta-klientow', users);
router.use('/zamowienia', orders);

module.exports = router;