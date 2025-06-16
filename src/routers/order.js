const express = require('express');

const { listProducts, updateProduct } = require('../use-cases/product');
const { addOrder } = require('../use-cases/order');
const { addDeliveryData } = require('../use-cases/delivery-data');
const { makeOrder, makeDeliveryData } = require('../entities');

const logger = require('../services/logger');
const { sendMail } = require('../services/mailer');
const { errors } = require('../utils/errors');
const user = require('../entities/user');

const router = express.Router();

router.get('/', async (req, res) => {
    if(!Array.isArray(req.session.cart) || req.session.cart.length <= 0 || req.session.cart.every(e => e.amount <= 0)) {
        return res.redirect(`/koszyk?action=access&error=${errors.badRequest[0]}`);
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

        orderPrice += product.price * cartItem.amount;
    }

    req.session.orderPrice = orderPrice;

    res.render('order/index', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart,
        orderPrice: orderPrice
    });
});

router.post('/podsumowanie', async (req, res) => {
    const { cart, user } = req.session;

    if(!Array.isArray(cart) || cart.length <= 0 || cart.every(e => e.amount <= 0)) {
        return res.redirect(`/zamowienie?action=access&error=${errors.badRequest[0]}`);
    }

    let { email, card } = req.body;

    if(!email) {
        if(!user) {
            return res.redirect(`/zamowienie?action=access&error=${errors.invalidData[0]}`);
        }

        email = user.login;
    }

    if(!card) {
        return res.redirect(`/zamowienie?action=access&error=${errors.invalidData[0]}`);
    }

    card = card.replace(/\s+/g, '');

    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zamowienie?action=access&error=${error.appCode}`);
    }

    // Check order price (later the same loop is used to update products' amount [line 168], but nevermind...)
    let orderPrice = 0;

    for(const cartItem of req.session.cart) {
        const product = products.find(e => e.id === cartItem.id);

        if(!product || cartItem.amount <= 0) {
            continue;
        }

        if(product.amount < cartItem.amount) {
            return res.redirect(`/zamowienie?action=access&error=${errors.badRequest[0]}`);
        }

        orderPrice += product.price * cartItem.amount;
    }

    if(orderPrice !== req.session.orderPrice) {
        logger.error(`Cart order price does not equals session order price.`);
        return res.redirect(`/zamowienie?action=access&error=${errors.badRequest[0]}`);
    }

    let order;

    try {
        order = makeOrder({
            userId: user ? user.id : null,
            productsIds: cart.map(e => e.id),
            productsAmount: cart.map(e => e.amount),
            date: new Date(Date.now()),
            price: orderPrice,
            card: card,
            paymentMade: true
        }, true);

        order = await addOrder({ order });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zamowienie?action=access&error=${error.appCode}`);
    }

    const { phone, firstName, lastName, street, house, apartment, postal, city } = req.body;

    let deliveryData;

    try {
        deliveryData = makeDeliveryData({
            orderId: order.id,
            phone: phone,
            firstName: firstName,
            lastName: lastName,
            street: street,
            house: house,
            apartment: apartment,
            postal: postal,
            city: city, 
            email: email
        }, true);
        deliveryData = await addDeliveryData({ deliveryData });
    } catch(error) {
        logger.error(error);
        deliveryData = false;
    }

    let orderUrl;

    if(user) {
        orderUrl = `/moje-konto/zamowienie?id=${order.id}`;
    } else {
        orderUrl = `/moje-konto/zamowienie?id=${order.id}&login=${encodeURIComponent(email)}`;
    }

    const mailOptions = {
        from: process.env.MAIL_USER,
        to: email,
        subject: `Szosa Sklep - zamówienie #${order.id}`,
        html: `<h1>Dziękujemy za zakup!</h1><p>Po potwierdzeniu płatności niezwłocznie przejdziemy do realizacji zamówienia. <br>Śledź swoje zamówienie <a href="${process.env.HOME_URL + orderUrl}">pod tym linkiem</a>.</p>`
    }

    const mailSent = await sendMail(mailOptions);

    // Update products' amount
    for(const cartItem of req.session.cart) {
        const product = products.find(e => e.id === cartItem.id);

        if(!product || cartItem.amount <= 0) {
            continue;
        }

        product.amount -= cartItem.amount;

        try {
            await updateProduct({ product });
        } catch(error) {
            logger.error(`Failed to update product ID ${product.id} amount!`);
            logger.error(error);
        }
    }

    req.session.cart = [];
    delete req.session.orderPrice;

    return res.render('order/summary', {
        path: '../',
        user: req.session.user,
        cart: req.session.cart,
        orderCart: cart,
        orderLogin: email,
        products: products,
        order: order,
        deliveryData: deliveryData,
        mailSent: mailSent
    });
});

module.exports = router;