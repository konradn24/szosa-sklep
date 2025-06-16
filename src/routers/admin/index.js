const express = require('express');

const { listOrders } = require('../../use-cases/order');

const logger = require('../../services/logger');

const products = require('./products');
const users = require('./users');
const orders = require('./orders');

const router = express.Router();

router.get('/', async (req, res) => {
    let orders = [];

    try {
        orders = await listOrders();
    } catch(error) {
        logger.error(error);
    }

    const ordersCount = orders.length;
    const paidOrdersCount = orders.filter(order => order.paymentMade).length;
    const completedOrdersCount = orders.filter(order => order.completed).length;
    const toPay = orders.filter(order => !order.paymentMade).reduce((acc, order) => acc + order.price, 0);
    const paid = orders.filter(order => order.paymentMade).reduce((acc, order) => acc + order.price, 0);

    res.render('admin/index', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart,
        ordersCount, paidOrdersCount, completedOrdersCount, toPay, paid
    });
});

router.use('/produkty', products);
router.use('/konta-klientow', users);
router.use('/zamowienia', orders);

module.exports = router;