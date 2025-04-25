const express = require('express');

const { getProduct, listProducts, addProduct, updateProduct, removeProduct } = require('../../use-cases/product');
const { listOrders } = require('../../use-cases/order');

const { makeProduct } = require('../../entities');

const { errors } = require('../../utils/errors');
const logger = require('../../services/logger');

const router = express.Router();

router.get('/', async (req, res) => {
    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    let orders = [];

    try {
        orders = await listOrders();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem?action=access&error=${error.appCode}`);
        }
    }

    res.render('admin/products/index', {
        path: '../../',
        user: req.session.user,
        cart: req.session.cart,
        products: products,
        orders: orders
    });
});

router.get('/dodaj', async (req, res) => {
    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);

        if(error.appCode !== errors.notFound[0]) {
            return res.redirect(`/zarzadzanie-sklepem/produkty?action=access&error=${error.appCode}`);
        }
    }

    let productsUrl = products.map(product => product.url);

    res.render('admin/products/add', {
        path: '../../../',
        user: req.session.user,
        cart: req.session.cart,
        productsUrl: productsUrl
    });
});

router.post('/dodaj', async (req, res) => {
    const productData = req.body;

    let imageUrl = null;
    
    if(req.files && req.files.image) {
        const image = req.files.image;
        const extensionRegex = /(?:\.([^.]+))?$/;
        const extension = extensionRegex.exec(image.name)[1];

        if(!['jpg', 'gif', 'png', 'tiff', 'bmp', 'jpeg'].includes(extension)) {
            logger.error(`Invalid image format provided: ${extension}`);
            return res.redirect(`/zarzadzanie-sklepem/produkty?action=add&error=${errors.invalidData[0]}`);
        }

        const currentTime = Date.now();
        imageUrl = currentTime.toString() + '.' + extension;
        image.mv(appRoot + '/public/img/uploads/' + imageUrl);
    }

    let product;

    try {
        product = makeProduct({
            name: productData.name,
            description: productData.description.length > 0 ? productData.description : null,
            url: productData.url,
            imageUrl: imageUrl,
            category: productData.category,
            price: productData.price,
            amount: productData.amount,
            views: 0
        }, true);
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=add&error=${error.appCode}`);
    }

    try {
        const r = await addProduct({ product });
        console.log(r)
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=add&error=${error.appCode}`);
    }

    res.redirect('/zarzadzanie-sklepem/produkty?action=add&success=true');
});

router.get('/edytuj', async (req, res) => {
    const { id } = req.query;

    if(isNaN(parseInt(id))) {
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=access&error=${errors.notFound}`);
    }

    let products = [];

    try {
        products = await listProducts();
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=access&error=${error.appCode}`);
    }

    const product = products.find(e => e.id === parseInt(id));

    if(!product) {
        logger.error(`Product of ID ${id} not found.`);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=access&error=${errors.notFound[0]}`);
    }

    let productsUrl = products.map(e => e.url !== product.url ? e.url : null);

    res.render('admin/products/edit', {
        path: '../../',
        user: req.session.user,
        cart: req.session.cart,
        product: product,
        productsUrl: productsUrl
    });
});

router.post('/edytuj', async (req, res) => {
    const { id } = req.query;

    if(isNaN(parseInt(id))) {
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=edit&error=${errors.notFound}`);
    }

    const productData = req.body;

    let imageUrl = null;
    
    if(req.files && req.files.image) {
        const image = req.files.image;
        const extensionRegex = /(?:\.([^.]+))?$/;
        const extension = extensionRegex.exec(image.name)[1];

        if(!['jpg', 'gif', 'png', 'tiff', 'bmp', 'jpeg'].includes(extension)) {
            logger.error(`Invalid image format provided: ${extension}`);
            return res.redirect(`/zarzadzanie-sklepem/produkty?action=edit&error=${errors.invalidData[0]}`);
        }

        const currentTime = Date.now();
        imageUrl = currentTime.toString() + '.' + extension;
        image.mv(appRoot + '/public/img/uploads/' + imageUrl);
    }

    if(!imageUrl) {
        try {
            const before = await getProduct({ id });
            imageUrl = before.imageUrl;
        } catch(error) {
            return res.redirect(`/zarzadzanie-sklepem/produkty?action=edit&error=${error.appCode}`);
        }
    }

    try {
        const product = await makeProduct({
            id: parseInt(id),
            name: productData.name,
            description: productData.description.length > 0 ? productData.description : null,
            url: productData.url,
            imageUrl: imageUrl,
            category: productData.category,
            price: productData.price,
            amount: productData.amount,
            views: 0
        });

        await updateProduct({ product });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=edit&error=${error.appCode}`);
    }

    res.redirect(`/zarzadzanie-sklepem/produkty?action=edit&success=${id}`);
});

router.post('/usun', async (req, res) => {
    const { id } = req.query;

    if(isNaN(parseInt(id))) {
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=delete&error=${errors.notFound}`);
    }

    try {
        await removeProduct({ id });
    } catch(error) {
        logger.error(error);
        return res.redirect(`/zarzadzanie-sklepem/produkty?action=delete&error=${error.appCode}`);
    }

    res.redirect('/zarzadzanie-sklepem/produkty?action=delete&success=true');
});

module.exports = router;