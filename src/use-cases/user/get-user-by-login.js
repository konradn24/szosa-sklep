const { makeUser } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeGetUserByLogin({ usersDb }) {
    return async function getUserByLogin({ login, name }) {
        const result = await usersDb.findByLogin({ login, name });
        const user = result.rows[0];

        if(!user) {
            throw new AppError(errors.notFound, "User not found.", ['Login'], [login]);
        }

        return makeUser({
            id: user.id,
            login: user.login,
            password: user.password,
            name: user.name,
            verified: user.verified,
            admin: user.admin
        });
    }
}