module.exports = function makeRemoveUser({ usersDb }) {
    return async function removeUser({ id }) {
        const result = await usersDb.remove({ id });
        
        return { "deletedCount": result.rows.affectedRows };
    }
}