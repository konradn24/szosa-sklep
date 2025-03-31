const makeAddProduct = require("./add-product");
const makeGetProduct = require("./get-product");
const makeGetProductByUrl = require("./get-product-by-url");
const makeListProducts = require("./list-products");
const makeUpdateProduct = require("./update-product");

const { productsDb } = require("../../data-access");

const addProduct = makeAddProduct({ productsDb });
const getProduct = makeGetProduct({ productsDb });
const getProductByUrl = makeGetProductByUrl({ productsDb });
const listProducts = makeListProducts({ productsDb });
const updateProduct = makeUpdateProduct({ productsDb });

module.exports = { addProduct, getProduct, getProductByUrl, listProducts, updateProduct };