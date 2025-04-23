const { AppError, errors } = require("../../utils/errors");

module.exports = function makeAddVerification({ verificationDb }) {
    return async function addVerification({ verification }) {
        const result = await verificationDb.insert({ verification });
        
        if(!result.rows.insertId) {
            throw new AppError(errors.notCreated, "Inserting verification failed.", ['Verification'], [verification], true);
        }
        
        verification.id = result.rows.insertId;
        return verification;
    }
}