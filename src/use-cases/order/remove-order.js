module.exports = function makeRemoveOrder({ ordersDb }) {
    return async function removeOrder({ id }) {
        const result = await ordersDb.remove({ id });
        
        return { "deletedCount": result.rows.affectedRows };
    }
}