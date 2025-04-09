const { makeUser } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeUpdateUser({ usersDb }) {
    return async function updateUser({ user }) {
        const result = await usersDb.update({ user });

        if(result.rows.affectedRows === 0) {
            throw new AppError(errors.notUpdated, "Updating user failed.", ['New user'], [user], true);
        }
        
        const updated = await usersDb.findById({ id: user.id });
        const updatedUser = updated.rows[0];

        if(!updatedUser) {
            throw new AppError(errors.notFound, "Updated user not found.", ['ID'], [id], true);
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