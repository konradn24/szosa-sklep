const express = require('express');

const { listProducts } = require('../use-cases/product');
const { addOrder } = require('../use-cases/order');
const { makeOrder } = require('../entities');

const logger = require('../services/logger');
const { sendMail } = require('../services/mailer');
const { errors } = require('../utils/errors');
const user = require('../entities/user');

const router = express.Router();

router.get('/', async (req, res) => {
    if(!Array.isArray(req.session.cart) || req.session.cart.length <= 0 || req.session.cart.every(e => e.amount <= 0)) {
        return res.redirect(`/koszyk?action=order&error=${errors.badRequest[0]}`);
    }

    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);
        return res.redirect(`/koszyk?action=access&error=${error.appCode}`);
    }

    let orderPrice = 0;

    for(const cartItem of req.session.cart) {
        const product = products.find(e => e.id === cartItem.id);

        if(!product) {
            continue;
        }

        orderPrice = product.price * cartItem.amount;
    }

    res.render('order/index', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart,
        orderPrice: orderPrice
    });
});

router.post('/podsumowanie', async (req, res) => {
    const cart = req.session.cart;

    if(!Array.isArray(cart) || cart.length <= 0 || cart.every(e => e.amount <= 0)) {
        return res.redirect(`/koszyk?action=payment&error=${errors.badRequest[0]}`);
    }

    let { login, card } = req.body;

    if(!card) {
        return res.redirect(`/zamowienie?action=payment&error=${errors.invalidData[0]}`);
    }

    card = card.replace(/\s+/g, '');

    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);
        return res.redirect(`/koszyk?action=payment&error=${error.appCode}`);
    }

    let orderPrice = 0;

    for(const cartItem of req.session.cart) {
        const product = products.find(e => e.id === cartItem.id);

        if(!product) {
            continue;
        }

        orderPrice = product.price * cartItem.amount;
    }

    let order;

    try {
        order = makeOrder({
            userId: user ? user.id : null,
            productsIds: cart.map(e => e.id),
            date: new Date(Date.now()),
            price: orderPrice,
            card: card,
            paymentMade: true
        }, true);

        order = await addOrder({ order });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/koszyk?action=payment&error=${error.appCode}`);
    }

    req.session.cart = [];

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: login,
        subject: `Szosa Sklep - zamówienie #${order.id}`,
        html: `<h1>Dziękujemy za zakup!</h1><p>Po potwierdzeniu płatności niezwłocznie przejdziemy do realizacji zamówienia. <br>Śledź swoje zamówienie <a href="http://localhost:3000/moje-konto/historia/${order.id}">pod tym linkiem</a>.</p>`
    }

    const mailSent = await sendMail(mailOptions);

    return res.render('order/summary', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart,
        orderCart: cart,
        products: products,
        order: order,
        mailSent: mailSent
    });
});

module.exports = router;