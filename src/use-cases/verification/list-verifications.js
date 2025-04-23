const { makeVerification } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");
const logger = require("../../services/logger");

module.exports = function makeListVerifications({ verificationDb }) {
    return async function listVerifications() {
        const result = await verificationDb.findAll();

        if(result.rows.length === 0) {
            throw new AppError(errors.notFound, "No verifications found.");
        }

        const verifications = [];
        const schemaErrors = [];
        
        for(var i = 0; i < result.rows.length; i++) {
            try {
                verifications.push(makeVerification({
                    id: result.rows[i].id,
                    login: result.rows[i].login,
                    code: result.rows[i].code
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
            logger.error(`Detected ${schemaErrors.length} invalid verification's schema.`);
        }

        return verifications;
    }
}