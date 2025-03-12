const buildMakeUser = require("./user");
const buildMakeProduct = require("./product");
const buildMakeOrder = require("./order");

const makeUser = buildMakeUser();
const makeProduct = buildMakeProduct();
const makeOrder = buildMakeOrder();

module.exports = { makeUser, makeProduct, makeOrder };