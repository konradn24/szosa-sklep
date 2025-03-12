const { AppError, errors } = require("../utils/errors");

module.exports = function buildMakeOrder() {
    return function makeOrder({
        id,
        userId,
        productId,
        date,
        price,
        card,
        paymentMade
    } = {}, clientProvidedData = false) {
        const error = clientProvidedData ? errors.invalidData : errors.schemaError;
        const isErrorCritical = !clientProvidedData;

        if(!id && !clientProvidedData) {
            throw new AppError(error, "Order must have an ID.", null, null, isErrorCritical);
        }

        if(id < 1) {
            throw new AppError(error, "Order's ID must be a positive number.", ['ID'], [id], isErrorCritical);
        }

        if(!userId) {
            throw new AppError(error, "Order must have an ID.", null, null, isErrorCritical);
        }

        if(userId < 1) {
            throw new AppError(error, "Order's user ID must be a positive number.", ['User ID'], [userId], isErrorCritical);
        }

        if(!productId) {
            throw new AppError(error, "Order must have an ID.", null, null, isErrorCritical);
        }

        if(productId < 1) {
            throw new AppError(error, "Order's user ID must be a positive number.", ['Product ID'], [productId], isErrorCritical);
        }

        if(!date) {
            throw new AppError(error, "Order must have a date.", null, null, isErrorCritical);
        }

        if(date < 0 || date > Date.now() + 10000) {
            throw new AppError(error, "Order's date must be between 0 and current time.", ['Date'], [date], isErrorCritical);
        }

        if(isNaN(parseInt(price))) {
            throw new AppError(error, "Order must have a valid price.", ['Price'], price, isErrorCritical);
        }

        if(card.length !== 16) {
            throw new AppError(error, "Order must have a valid card number.", ['Card'], card, isErrorCritical);
        }

        if(paymentMade !== true && paymentMade !== false) {
            throw new AppError(error, "Order's paymentMade property must be a boolean.", ['Payment made'], paymentMade, isErrorCritical);
        }

        return { id, userId, productId, date, price, card, paymentMade };
    }
}