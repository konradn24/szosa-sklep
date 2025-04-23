const express = require('express');

const { listProducts, addProduct } = require('../use-cases/product');

const { errors } = require('../utils/errors');
const logger = require('../services/logger');
const { makeProduct } = require('../entities');

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

    let imageUrl = null;
    
    if(req.files && req.files.image) {
        const currentTime = Date.now();
        imageUrl = String.toString(currentTime);
        req.files.image.mv(appRoot + '/public/img/' + imageUrl);
    }

    let product;

    try {
        product = makeProduct({
            name: req.body.name,
            description: req.body.description.length > 0 ? req.body.description : null,
            url: req.body.url,
            imageUrl: imageUrl,
            category: req.body.category,
            price: req.body.price,
            amount: req.body.amount
        }, true);
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=add&error=${error.appCode}`);
    }

    try {
        await addProduct({ product });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=add&error=${error.appCode}`);
    }

    res.redirect('/zarzadzanie-sklepem/produkty?action=add&success=true');
});

module.exports = router;