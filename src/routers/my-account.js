const express = require('express');

const { createHash } = require('crypto');

const { updateUser } = require('../use-cases/user');
const { listProducts } = require('../use-cases/product');
const { getOrder, listOrders } = require('../use-cases/order');
const { getDeliveryData } = require('../use-cases/delivery-data');

const { errors } = require('../utils/errors');
const logger = require('../services/logger');

const router = express.Router();

router.get('/', async (req, res) => {
    if(!req.session.user) {
        return res.redirect('/logowanie');
    }

    let orders = [];

    try {
        orders = await listOrders();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/?action=access&error=${error.appCode}`);
        }
    }

    orders = orders.filter(order => order.userId === req.session.user.id);

    res.render('my-account/index', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart,
        orders: orders
    });
});

router.get('/zamowienie', async (req, res) => {
    const { id } = req.query;
    const login = decodeURIComponent(req.query.login);

    if(!req.session.user && login === 'undefined') {
        return res.redirect('/logowanie');
    }

    let order;

    try {
        order = await getOrder({ id });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/moje-konto?action=access&error=${error.appCode}`);
    }

    if(login === 'undefined' && order.userId !== req.session.user.id) {
        return res.redirect(`/moje-konto?action=access&error=${errors.notFound[0]}`);
    }

    let deliveryData;

    try {
        deliveryData = await getDeliveryData({ orderId: id });
    } catch(error) {
        logger.error(error);
    }

    if(login !== 'undefined') {
        if(order.userId || !deliveryData) {
            return res.redirect(`/?action=access&error=${errors.notFound[0]}`);
        }

        if(login !== deliveryData.email) {
            return res.redirect(`/?action=access&error=${errors.notFound[0]}`);
        }
    }

    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);
        return res.redirect(`/moje-konto?action=access&error=${error.appCode}`);
    }

    let orderedProducts = [];

    for(let i = 0; i < order.productsIds.length; i++) {
        const product = products.find(product => product.id === order.productsIds[i]);

        if(product) {
            product.orderedAmount = order.productsAmount[i];
        }

        orderedProducts.push(product);
    }

    res.render('my-account/details', {
        path: '../../',
        user: req.session.user,
        cart: req.session.cart,
        order: order,
        deliveryData: deliveryData,
        products: orderedProducts
    });
});

router.post('/zmiana-hasla', async (req, res) => {
    if(!req.session.user) {
        return res.redirect('/logowanie');
    }

    const { password, passwordRepeat } = req.body;

    if(password !== passwordRepeat) {
        return res.redirect(`/moje-konto?action=change-password&error=${errors.invalidData[0]}`);
    }

    const newPassword = createHash('sha256').update(password).digest('hex');
    const user = req.session.user;
    user.password = newPassword;

    try {
        await updateUser({ user });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/moje-konto?action=change-password&error=${error.appCode}`);
    }

    req.session.user = user;

    return res.redirect('/moje-konto?action=change-password&success=true');
});

module.exports = router;