const buildMakeUser = require("./user");
const buildMakeProduct = require("./product");
const buildMakeOrder = require("./order");
const buildMakeVerification = require("./verification");

const makeUser = buildMakeUser();
const makeProduct = buildMakeProduct();
const makeOrder = buildMakeOrder();
const makeVerification = buildMakeVerification();

module.exports = { makeUser, makeProduct, makeOrder, makeVerification };