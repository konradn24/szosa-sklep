const { AppError, errors } = require("../utils/errors");

module.exports = function buildMakeUser() {
    return function makeUser({
        id,
        login,
        password = null,
        name,
        admin
    } = {}, clientProvidedData = false) {
        const error = clientProvidedData ? errors.invalidData : errors.schemaError;
        const isErrorCritical = !clientProvidedData;

        if(!id && !clientProvidedData) {
            throw new AppError(error, "User must have an ID.", null, null, isErrorCritical);
        }

        if(id < 1) {
            throw new AppError(error, "User's ID must be a positive number.", ['ID'], [id], isErrorCritical);
        }

        if(!login || !login.includes("@", 1) || !login.includes(".", 3)) {
            throw new AppError(error, "Login must be a valid e-mail address.", ['Login'], [login], isErrorCritical);
        }

        if(!password && password !== null) {
            throw new AppError(error, "User must have a password.", null, null, isErrorCritical);
        }

        if(!name) {
            throw new AppError(error, "User must have a name.", null, null, isErrorCritical);
        }

        if(name.length < 2 || name.length > 128) {
            throw new AppError(error, "User's name must contain 2-128 characters.", ['Name'], [name], isErrorCritical);
        }

        if(admin !== true && admin !== false) {
            throw new AppError(error, "User's admin property must be a boolean value.", ['Admin'], [admin])
        }

        return { id, login, password, name, admin };
    }
}