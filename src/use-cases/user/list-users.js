const { makeUser } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");
const logger = require("../../utils/logger");

module.exports = function makeListUsers({ usersDb }) {
    return async function listUsers() {
        const result = await usersDb.findAll();

        if(result.rows.length === 0) {
            throw new AppError(errors.notFound, "No users found.");
        }

        const users = [];
        const schemaErrors = [];
        
        for(var i = 0; i < result.rows.length; i++) {
            try {
                users.push(makeUser({
                    id: result.rows[i].id,
                    login: result.rows[i].login,
                    password: result.rows[i].password,
                    name: result.rows[i].name,
                    admin: result.rows[i].admin
                }));
            } catch(error) {
                if(error instanceof AppError && error.appCode === errors.schemaError[0]) {
                    schemaErrors.push(error);
                    continue;
                } else {
                    throw error;
                }
            }
        }

        if(schemaErrors.length > 0) {
            logger.error(`Detected ${schemaErrors.length} invalid user's schema.`);
        }

        return users;
    }
}