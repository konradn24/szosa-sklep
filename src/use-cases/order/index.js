const makeAddOrder = require("./add-order");
const makeGetOrder = require("./get-order");
const makeListOrders = require("./list-orders");
const makeUpdateOrder = require("./update-order");
const makeRemoveOrder = require("./remove-order");

const { ordersDb } = require("../../data-access");
const { parseDate } = require("../../utils");

const addOrder = makeAddOrder({ ordersDb });
const getOrder = makeGetOrder({ ordersDb, parseDate });
const listOrders = makeListOrders({ ordersDb, parseDate });
const updateOrder = makeUpdateOrder({ ordersDb, parseDate });
const removeOrder = makeRemoveOrder({ ordersDb });

module.exports = { addOrder, getOrder, listOrders, updateOrder, removeOrder };