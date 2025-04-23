module.exports = function makeRemoveVerification({ verificationDb }) {
    return async function removeVerification({ id }) {
        const result = await verificationDb.remove({ id });
        
        return { "deletedCount": result.rows.affectedRows };
    }
}