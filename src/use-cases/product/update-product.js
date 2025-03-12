const { makeProduct } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeUpdateProduct({ productsDb }) {
    return async function updateProduct({ product }) {
        const result = await productsDb.update({ product });

        if(result.rows.affectedRows === 0) {
            throw new AppError(errors.notUpdated, "Updating product failed.", ['New product'], [product], true);
        }
        
        const updated = await productsDb.findById({ id: product.id });
        const updatedProduct = updated.rows[0];

        if(!updatedProduct) {
            throw new AppError(errors.notFound, "Updated product not found.", ['ID'], [id], true);
        }

        return makeProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            imageUrl: product.image_url,
            category: product.category,
            price: product.price,
            amount: product.amount
        });
    }
}