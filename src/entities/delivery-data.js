const { AppError, errors } = require("../utils/errors");

module.exports = function buildMakeVerification() {
    return function makeVerification({
        orderId,
        phone,
        firstName,
        lastName,
        street,
        house,
        apartment = '',
        postal,
        city,
        email
    } = {}, clientProvidedData = false) {
        const error = clientProvidedData ? errors.invalidData : errors.schemaError;
        const isErrorCritical = !clientProvidedData;

        if(!orderId) {
            throw new AppError(error, "Delivery data must have an order ID.", null, null, isErrorCritical);
        }

        if(!phone) {
            throw new AppError(error, "Delivery data must have a phone number.", null, null, isErrorCritical);
        }

        if(!firstName) {
            throw new AppError(error, "Delivery data must have a first name.", null, null, isErrorCritical);
        }

        if(!lastName) {
            throw new AppError(error, "Delivery data must have a last name.", null, null, isErrorCritical);
        }

        if(!street) {
            throw new AppError(error, "Delivery data must have a street.", null, null, isErrorCritical);
        }

        if(!house) {
            throw new AppError(error, "Delivery data must have a house number.", null, null, isErrorCritical);
        }

        if(!apartment && typeof apartment !== 'string') {
            throw new AppError(error, "Delivery data must have an apartment number (can be empty).", null, null, isErrorCritical);
        }

        if(!postal) {
            throw new AppError(error, "Delivery data must have a postal code.", null, null, isErrorCritical);
        }

        if(!city) {
            throw new AppError(error, "Delivery data must have a city.", null, null, isErrorCritical);
        }

        if(!email) {
            throw new AppError(error, "Delivery data must have an email.", null, null, isErrorCritical);
        }

        return { orderId, phone, firstName, lastName, street, house, apartment, postal, city, email };
    }
}