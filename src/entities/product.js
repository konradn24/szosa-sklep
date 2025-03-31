const { AppError, errors } = require("../utils/errors");

module.exports = function buildMakeProduct() {
    return function makeProduct({
        id,
        name,
        description = null,
        url,
        imageUrl = null,
        category = null,
        price,
        amount
    } = {}, clientProvidedData = false) {
        const error = clientProvidedData ? errors.invalidData : errors.schemaError;
        const isErrorCritical = !clientProvidedData;

        if(!id && !clientProvidedData) {
            throw new AppError(error, "Product must have an ID.", null, null, isErrorCritical);
        }

        if(id < 1) {
            throw new AppError(error, "Product's ID must be a positive number.", ['ID'], [id], isErrorCritical);
        }

        if(!name) {
            throw new AppError(error, "Product must have a name.", null, null, isErrorCritical);
        }

        if(name.length < 2 || name.length > 256) {
            throw new AppError(error, "Product's name must contain 2-256 characters.", ['Name'], [name], isErrorCritical);
        }

        if(!url) {
            throw new AppError(error, "Product must have a URL.", null, null, isErrorCritical);
        }

        if(url.length < 2 || url.length > 64) {
            throw new AppError(error, "Product's URL must contain 2-64 characters.", ['URL'], [url], isErrorCritical);
        }

        if(isNaN(parseInt(price))) {
            throw new AppError(error, "Product must have a valid price.", ['Price'], price, isErrorCritical);
        }

        if(isNaN(parseInt(amount))) {
            throw new AppError(error, "Product must have a valid amount.", ['Amount'], amount, isErrorCritical);
        }

        return { id, name, description, url, imageUrl, category, price, amount };
    }
}