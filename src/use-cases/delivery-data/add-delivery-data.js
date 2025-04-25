const { AppError, errors } = require("../../utils/errors");

module.exports = function makeAddDeliveryData({ deliveryDataDb }) {
    return async function addDeliveryData({ deliveryData }) {
        await deliveryDataDb.insert({ deliveryData });
        
        return deliveryData;
    }
}