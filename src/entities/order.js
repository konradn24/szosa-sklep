const { AppError, errors } = require("../utils/errors");

module.exports = function buildMakeOrder() {
    return function makeOrder({
        id,
        userId = null,
        productsIds,
        productsAmount,
        date,
        price,
        card,
        paymentMade,
        completed = false
    } = {}, clientProvidedData = false) {
        const error = clientProvidedData ? errors.invalidData : errors.schemaError;
        const isErrorCritical = !clientProvidedData;

        if(!id && !clientProvidedData) {
            throw new AppError(error, "Order must have an ID.", null, null, isErrorCritical);
        }

        if(id < 1) {
            throw new AppError(error, "Order's ID must be a positive number.", ['ID'], [id], isErrorCritical);
        }

        if(userId && userId < 1) {
            throw new AppError(error, "Order's user ID must be a positive number.", ['User ID'], [userId], isErrorCritical);
        }

        if(!productsIds) {
            throw new AppError(error, "Order must have a products IDs.", null, null, isErrorCritical);
        }

        if(!Array.isArray(productsIds) || productsIds.length <= 0) {
            throw new AppError(error, "Order's products IDs must be a valid array.", ['Products IDs'], [productsIds], isErrorCritical);
        }

        if(!productsAmount) {
            throw new AppError(error, "Order must have a products' amount.", null, null, isErrorCritical);
        }

        if(!Array.isArray(productsAmount) || productsAmount.length <= 0) {
            throw new AppError(error, "Order's products' amount must be a valid array.", ['Products amount'], [productsAmount], isErrorCritical);
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

        if(completed !== true && completed !== false) {
            throw new AppError(error, "Order's completed property must be a boolean.", ['Completed'], completed, isErrorCritical);
        }

        return { id, userId, productsIds, productsAmount, date, price, card, paymentMade, completed };
    }
}