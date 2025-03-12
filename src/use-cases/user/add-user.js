const { AppError, errors } = require("../../utils/errors");

module.exports = function makeAddUser({ usersDb }) {
    return async function addUser({ user }) {
        const result = await usersDb.insert({ user });
        
        if(!result.rows.insertId) {
            throw new AppError(errors.notCreated, "Inserting user failed.", ['User'], [user], true);
        }
        
        user.id = result.rows.insertId;
        return user;
    }
}