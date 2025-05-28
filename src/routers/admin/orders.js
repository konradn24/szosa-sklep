const express = require('express');

const { listUsers } = require('../../use-cases/user');
const { listProducts } = require('../../use-cases/product');
const { getOrder, listOrders } = require('../../use-cases/order');
const { getDeliveryData, listDeliveriesData } = require('../../use-cases/delivery-data')

const { countOccurence } = require('../../utils');
const { errors } = require('../../utils/errors');
const logger = require('../../services/logger');

const router = express.Router();

router.get('/', async (req, res) => {
    let orders = [];

    try {
        orders = await listOrders();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    let deliveriesData = [];

    try {
        deliveriesData = await listDeliveriesData();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    let users = [];

    try {
        users = await listUsers();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    for(let i = 0; i < users.length; i++) {
        users[i].ordersCount = countOccurence(orders.map(order => order.userId), users[i].id);
    }

    res.render('admin/orders/index', {
        path: '../../',
        user: req.session.user,
        cart: req.session.cart,
        users: users,
        orders: orders,
        deliveriesData: deliveriesData
    });
});

router.get('/szczegoly', async (req, res) => {
    const { id } = req.query;

    let order;

    try {
        order = await getOrder({ id });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/zamowienia?action=access&error=${error.appCode}`);
    }

    let deliveryData;

    try {
        deliveryData = await getDeliveryData({ orderId: id });
    } catch(error) {
        logger.error(error);
    }

    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/zamowienia?action=access&error=${error.appCode}`);
    }

    let orderedProducts = [];

    for(let i = 0; i < order.productsIds.length; i++) {
        const product = products.find(product => product.id === order.productsIds[i]);

        if(product) {
            product.orderedAmount = order.productsAmount[i];
        }

        orderedProducts.push(product);
    }

    res.render('admin/orders/details', {
        path: '../../',
        user: req.session.user,
        cart: req.session.cart,
        order: order,
        deliveryData: deliveryData,
        products: orderedProducts
    });
});

module.exports = router;