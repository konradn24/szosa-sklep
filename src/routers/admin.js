const express = require('express');

const { listProducts } = require('../use-cases/product');

const { errors } = require('../utils/errors');
const logger = require('../services/logger');

const router = express.Router();

router.get('/', async (req, res) => {
    res.render('admin/index', {
        path: '../',
        user: req.session.user
    });
});

router.get('/produkty', async (req, res) => {
    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    res.render('admin/products/index', {
        path: '../../',
        user: req.session.user,
        products: products
    });
});

router.get('/produkty/dodaj', (req, res) => {
    res.render('admin/products/add', {
        path: '../../../',
        user: req.session.user
    });
});

router.post('/produkty/dodaj', async (req, res) => {
    const productData = req.body;

    console.log(productData);

    res.redirect('/zarzadzanie-sklepem/produkty?action=add&success=true');
});

module.exports = router;