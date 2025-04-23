const { makeProduct } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeGetProduct({ productsDb }) {
    return async function getProduct({ id }) {
        const result = await productsDb.findById({ id });
        const product = result.rows[0];

        if(!product) {
            throw new AppError(errors.notFound, "Product not found.", ['ID'], [id]);
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