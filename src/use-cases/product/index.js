const makeAddProduct = require("./add-product");
const makeGetProduct = require("./get-product");
const makeGetProductByUrl = require("./get-product-by-url");
const makeListProducts = require("./list-products");
const makeUpdateProduct = require("./update-product");
const makeUpdateProductViews = require("./update-product-views");
const makeRemoveProduct = require("./remove-product");

const { productsDb } = require("../../data-access");

const addProduct = makeAddProduct({ productsDb });
const getProduct = makeGetProduct({ productsDb });
const getProductByUrl = makeGetProductByUrl({ productsDb });
const listProducts = makeListProducts({ productsDb });
const updateProduct = makeUpdateProduct({ productsDb });
const updateProductViews = makeUpdateProductViews({ productsDb });
const removeProduct = makeRemoveProduct({ productsDb });

module.exports = { addProduct, getProduct, getProductByUrl, listProducts, updateProduct, updateProductViews, removeProduct };