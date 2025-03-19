const express = require("express");

const { listProducts } = require("../use-cases/product");

const router = express.Router();

router.get("/", (req, res) => {
    // const products = listProducts();

    res.render("index", {
        user: req.session.user,
        // products: products
    });
});

module.exports = router;