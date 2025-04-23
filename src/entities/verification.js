const { AppError, errors } = require("../utils/errors");

module.exports = function buildMakeVerification() {
    return function makeVerification({
        id,
        login,
        code
    } = {}, clientProvidedData = false) {
        const error = clientProvidedData ? errors.invalidData : errors.schemaError;
        const isErrorCritical = !clientProvidedData;

        if(!id && !clientProvidedData) {
            throw new AppError(error, "Verification must have an ID.", null, null, isErrorCritical);
        }

        if(id < 1) {
            throw new AppError(error, "Verification's ID must be a positive number.", ['ID'], [id], isErrorCritical);
        }

        if(!login || !login.includes("@", 1) || !login.includes(".", 3)) {
            throw new AppError(error, "Login must be a valid e-mail address.", ['Login'], [login], isErrorCritical);
        }

        if(!code || code.length !== 6) {
            throw new AppError(error, "Verification code must be a 6 digit string.", ['code'], [code], isErrorCritical);
        }

        return { id, login, code };
    }
}