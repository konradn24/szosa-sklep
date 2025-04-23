const { makeVerification } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

const logger = require('../../services/logger');

module.exports = function makeGetVerification({ verificationDb }) {
    return async function getVerification({ id, login, code }) {
        let result;

        if(id) {
            result = await verificationDb.findById({ id });
        } else if(login) {
            result = await verificationDb.findByLogin({ login });
        } else if(code) {
            result = await verificationDb.findByCode({ code });
        }
        
        if(result.rows.length > 1) {
            logger.warning(`Found ${result.rows.length} duplicates of verification record! ID: ${id}, login: ${login}, code: ${code}`);
        }

        const verification = result.rows[0];

        if(!verification) {
            throw new AppError(errors.notFound, "Verification not found.", ['ID', 'login', 'code'], [id, login, code]);
        }

        return makeVerification({
            id: verification.id,
            login: verification.login,
            code: verification.code
        });
    }
}