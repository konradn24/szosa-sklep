const { makeUser } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeGetUserByLogin({ usersDb }) {
    return async function getUserByLogin({ login }) {
        const result = await usersDb.findByLogin({ login });
        const user = result.rows[0];

        if(!user) {
            throw new AppError(errors.notFound, "User not found.", ['Login'], [login]);
        }

        return makeUser({
            id: user.id,
            login: user.login,
            password: user.password,
            name: user.name,
            admin: user.admin
        });
    }
}