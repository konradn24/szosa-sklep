const express = require("express");
const { createHash } = require("crypto");

const { listUsers } = require("../use-cases/user")
const { listProducts } = require("../use-cases/product");
const logger = require("../utils/logger");
const { errors } = require("../utils/errors");

const router = express.Router();

router.get("/", async (req, res) => {
    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(`Failed to fetch products. ${error}`);
    }

    res.render("index", {
        user: req.session.user,
        products: products
    });
});

router.get("/logowanie", (req, res) => {
    if(req.session.user) {
        return res.redirect('/');
    }

    res.render("auth/login", {
        path: '../'
    });
});

router.get("/rejestracja", async (req, res) => {
    if(req.session.user) {
        return res.redirect('/');
    }

    let users = [];

    try {
        users = await listUsers();
    } catch(error) {
        console.error(error);
    }

    for(const user of users) {
        delete user.password;
        delete user.admin;
        user.name = createHash('sha256').update(user.name).digest('hex');
        user.login = createHash('sha256').update(user.login).digest('hex');
    }

    res.render("auth/register", {
        path: '../',
        users: users
    });
});

router.get("/produkt/:productUrl", async (req, res) => {
    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(`Failed to fetch products. ${error}`);
        return res.redirect(`/?action=access&error=${error.appCode}`);
    }

    const productUrl = req.params.productUrl;
    const product = products.find(e => e.url === productUrl);

    if(!product) {
        logger.error(`Product of URL ${productUrl} not found.`);
        return res.redirect(`/?action=access&error=${errors.notFound}`);
    }

    res.render("product", {
        path: '../',
        user: req.session.user,
        products: products,
        product: product
    });
});

module.exports = router;