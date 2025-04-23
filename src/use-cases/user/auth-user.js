const { makeUser } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeAuthUser({ usersDb }) {
    return async function authUser({ login, password }) {
        const result = await usersDb.findByCredentials({ login, password });
        const user = result.rows[0];

        if(!user) {
            throw new AppError(errors.unauthorized, "Invalid credentials.", ['Login', 'Password'], [login, password]);
        }

        return makeUser({
            id: user.id,
            login: user.login,
            password: user.password,
            name: user.name,
            verified: user.verified === 1 ? true : false,
            admin: user.admin === 1 ? true : false
        });
    }
}