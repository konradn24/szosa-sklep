const buildMakeUser = require("./user");
const buildMakeProduct = require("./product");
const buildMakeOrder = require("./order");
const buildMakeVerification = require("./verification");
const buildMakeDeliveryData = require("./delivery-data");

const makeUser = buildMakeUser();
const makeProduct = buildMakeProduct();
const makeOrder = buildMakeOrder();
const makeVerification = buildMakeVerification();
const makeDeliveryData = buildMakeDeliveryData();

module.exports = { makeUser, makeProduct, makeOrder, makeVerification, makeDeliveryData };