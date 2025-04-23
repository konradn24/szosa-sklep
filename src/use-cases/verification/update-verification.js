const { makeVerification } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeUpdateVerification({ verificationDb }) {
    return async function updateVerification({ verification }) {
        const result = await verificationDb.update({ verification });

        if(result.rows.affectedRows === 0) {
            throw new AppError(errors.notUpdated, "Updating verification failed.", ['New verification'], [verification], true);
        }
        
        const updated = await verificationDb.findById({ id: verification.id });
        const updatedVerification = updated.rows[0];

        if(!updatedVerification) {
            throw new AppError(errors.notFound, "Updated verification not found.", ['ID'], [id], true);
        }

        return makeVerification({
            id: verification.id,
            login: verification.login,
            code: verification.code
        });
    }
}