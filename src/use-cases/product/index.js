const makeAddProduct = require("./add-product");
const makeGetProduct = require("./get-product");
const makeListProducts = require("./list-products");
const makeUpdateProduct = require("./update-product");

const { productsDb } = require("../../data-access");

const addProduct = makeAddProduct({ productsDb });
const getProduct = makeGetProduct({ productsDb });
const listProducts = makeListProducts({ productsDb });
const updateProduct = makeUpdateProduct({ productsDb });

module.exports = { addProduct, getProduct, listProducts, updateProduct };