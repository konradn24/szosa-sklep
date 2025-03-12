const { makeUser } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeGetUser({ usersDb }) {
    return async function getUser({ id }) {
        const result = await usersDb.findById({ id });
        const user = result.rows[0];

        if(!user) {
            throw new AppError(errors.notFound, "User not found.", ['ID'], [id]);
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