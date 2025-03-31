const { makeProduct } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");
const logger = require("../../utils/logger");

module.exports = function makeListProducts({ productsDb }) {
    return async function listProducts() {
        const result = await productsDb.findAll();

        if(result.rows.length === 0) {
            throw new AppError(errors.notFound, "No products found.");
        }

        const products = [];
        const schemaErrors = [];
        
        for(var i = 0; i < result.rows.length; i++) {
            try {
                products.push(makeProduct({
                    id: result.rows[i].id,
                    name: result.rows[i].name,
                    description: result.rows[i].description,
                    url: result.rows[i].url,
                    imageUrl: result.rows[i].image_url,
                    category: result.rows[i].category,
                    price: result.rows[i].price,
                    amount: result.rows[i].amount
                }));
            } catch(error) {
                if(error instanceof AppError && error.appCode === errors.schemaError[0]) {
                    schemaErrors.push(error);
                    continue;
                } else {
                    throw error;
                }
            }
        }

        if(schemaErrors.length > 0) {
            logger.error(`Detected ${schemaErrors.length} invalid product's schema.`);
        }

        return products;
    }
}