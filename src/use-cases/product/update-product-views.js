const { makeProduct } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeUpdateProductViews({ productsDb }) {
    return async function updateProductViews({ id }) {
        const result = await productsDb.updateViews({ id });

        if(result.rows.affectedRows === 0) {
            throw new AppError(errors.notUpdated, "Updating product's views failed.", ['ID'], [id], true);
        }
        
        const updated = await productsDb.findById({ id });
        const updatedProduct = updated.rows[0];

        if(!updatedProduct) {
            throw new AppError(errors.notFound, "Updated product not found.", ['ID'], [id], true);
        }

        return makeProduct({
            id: product.id,
            name: product.name,
            description: product.description,
            url: product.url,
            imageUrl: product.image_url,
            category: product.category,
            price: product.price,
            amount: product.amount,
            views: product.views
        });
    }
}