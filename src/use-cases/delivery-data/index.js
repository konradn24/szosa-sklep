const makeAddDeliveryData = require("./add-delivery-data");
const makeGetDeliveryData = require("./get-delivery-data");
const makeListDeliveriesData = require("./list-deliveries-data");
const makeRemoveDeliveryData = require("./remove-delivery-data");

const { deliveryDataDb } = require("../../data-access");

const addDeliveryData = makeAddDeliveryData({ deliveryDataDb });
const getDeliveryData = makeGetDeliveryData({ deliveryDataDb });
const listDeliveriesData = makeListDeliveriesData({ deliveryDataDb });
const removeDeliveryData = makeRemoveDeliveryData({ deliveryDataDb });

module.exports = { addDeliveryData, getDeliveryData, listDeliveriesData, removeDeliveryData };