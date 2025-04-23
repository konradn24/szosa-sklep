module.exports = function makeRemoveProduct({ productsDb }) {
    return async function removeProduct({ id }) {
        const result = await productsDb.remove({ id });
        
        return { "deletedCount": result.rows.affectedRows };
    }
}