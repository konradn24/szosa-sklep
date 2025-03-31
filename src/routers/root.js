const express = require("express");

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

router.get("/:productUrl", async (req, res) => {
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
        user: req.session.user,
        products: products,
        product: product
    });
});

module.exports = router;