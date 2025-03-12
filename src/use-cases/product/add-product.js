const { AppError, errors } = require("../../utils/errors");

module.exports = function makeAddProduct({ productsDb }) {
    return async function addProduct({ product }) {
        const result = await productsDb.insert({ product });
        
        if(!result.rows.insertId) {
            throw new AppError(errors.notCreated, "Inserting product failed.", ['Product'], [product], true);
        }
        
        product.id = result.rows.insertId;
        return product;
    }
}