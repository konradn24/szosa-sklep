const express = require('express');

const { getProduct, listProducts } = require('../use-cases/product');
const logger = require('../services/logger');

const { errors } = require('../utils/errors');

const router = express.Router();

router.get('/', async (req, res) => {
    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/?action=access&error=${error.appCode}`);
        }
    }

    let orderPrice = 0;

    if(Array.isArray(req.session.cart)) {
        for(const cartItem of req.session.cart) {
            const product = products.find(e => e.id === cartItem.id);
    
            if(!product) {
                continue;
            }
    
            orderPrice += product.price * cartItem.amount;
        }
    }

    res.render('cart', {
        user: req.session.user,
        cart: req.session.cart,
        products: products,
        orderPrice: orderPrice
    })
});

router.post('/dodaj', async (req, res) => {
    let { id, amount, url } = req.body;

    id = parseInt(id);
    amount = parseInt(amount);

    if(isNaN(id)) {
        logger.error(`Cannot add product to cart - invalid ID (${id})`);
        return res.redirect(`/produkt/${url}?action=cart-add&error=${errors.invalidData[0]}`);
    }

    if(isNaN(amount) || amount <= 0) {
        logger.error(`Cannot add product to cart - invalid amount (${amount})`);
        return res.redirect(`/produkt/${url}?action=cart-add&error=${errors.invalidData[0]}`);
    }

    if(!Array.isArray(req.session.cart)) {
        req.session.cart = [];
    }

    const productIndex = req.session.cart.findIndex(e => e.id === id);

    let product;

    try {
        product = await getProduct({ id });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/produkt/${url}?action=cart-add&error=${error.appCode}`);
    }

    if(productIndex >= 0) {
        const currentAmount = req.session.cart[productIndex].amount;
        
        if(product.amount < currentAmount + amount) {
            logger.error(`Cannot add product to cart - amount is too much (${currentAmount + amount}/${product.amount})`);
            return res.redirect(`/produkt/${url}?action=cart-add&error=${errors.invalidData[0]}`);
        }

        req.session.cart[productIndex].amount = currentAmount + amount;
    } else {
        if(product.amount < amount) {
            logger.error(`Cannot add product to cart - amount is too much (${amount}/${product.amount})`);
            return res.redirect(`/produkt/${url}?action=cart-add&error=${errors.invalidData[0]}`);
        }

        req.session.cart.push({ id, amount });
    }

    res.redirect(`/produkt/${url}?action=cart-add&success=${amount}`);
});

router.post('/modyfikuj', async (req, res) => {
    let { id, amount } = req.body;

    id = parseInt(id);
    amount = parseInt(amount);

    if(isNaN(id)) {
        logger.error(`Cannot modify product in cart - invalid ID (${id})`);
        return res.redirect(`/koszyk?action=modify&error=${errors.invalidData[0]}`);
    }

    if(isNaN(amount) || amount < 0) {
        logger.error(`Cannot modify product in cart - invalid amount (${amount})`);
        return res.redirect(`/koszyk?action=modify&error=${errors.invalidData[0]}`);
    }

    if(!Array.isArray(req.session.cart)) {
        req.session.cart = [];
    }

    const productIndex = req.session.cart.findIndex(e => e.id === id);

    if(productIndex >= 0) {
        try {
            const product = await getProduct({ id });
    
            if(product.amount < amount) {
                logger.error(`Cannot modify product in cart - amount is too much (${currentAmount + amount}/${product.amount})`);
                return res.redirect(`/koszyk?action=cart-add&error=${errors.invalidData[0]}`);
            }
        } catch(error) {
            logger.error(error);
            return res.redirect(`/koszyk?action=cart-add&error=${error.appCode}`);
        }

        req.session.cart[productIndex].amount = amount;
    } else {
        logger.error(`Cannot modify product in cart - product not found (ID ${id})`);
        return res.redirect(`/koszyk?action=modify&error=${errors.invalidData[0]}`);
    }

    res.redirect(`/koszyk?action=modify&success=${amount}`);
});

router.post('/usun', (req, res) => {
    let { id } = req.body;

    id = parseInt(id);

    if(isNaN(id)) {
        logger.error(`Cannot remove product from cart - invalid ID (${id})`);
        return res.redirect(`/koszyk?action=remove&error=${errors.invalidData[0]}`);
    }

    if(!Array.isArray(req.session.cart)) {
        logger.error(`Cannot remove product from cart - no cart object in session`);
        return res.redirect(`/koszyk?action=remove&error=${errors.badRequest[0]}`);
    }

    const productIndex = req.session.cart.findIndex(e => e.id === id);

    if(productIndex >= 0) {
        req.session.cart[productIndex].amount = 0;
    } else {
        logger.error(`Cannot remove product from cart - product not found (ID ${id})`);
        return res.redirect(`/koszyk?action=remove&error=${errors.notFound[0]}`);
    }

    res.redirect(`/koszyk?action=remove&success=true`);
});

router.post('/wyczysc', (req, res) => {
    req.session.cart = [];

    res.redirect(`/koszyk?action=clear&success=true`);
});

module.exports = router;