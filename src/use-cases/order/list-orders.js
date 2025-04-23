const { makeOrder } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");
const logger = require("../../services/logger");

module.exports = function makeListOrders({ ordersDb }) {
    return async function listOrders() {
        const result = await ordersDb.findAll();

        if(result.rows.length === 0) {
            throw new AppError(errors.notFound, "No orders found.");
        }

        const orders = [];
        const schemaErrors = [];
        
        for(var i = 0; i < result.rows.length; i++) {
            try {
                orders.push(makeOrder({
                    id: result.rows[i].id,
                    userId: result.rows[i].user_id,
                    productId: result.rows[i].product_id,
                    date: parseDate(result.rows[i].date),
                    price: result.rows[i].price,
                    card: result.rows[i].card,
                    paymentMade: result.rows[i].payment_made
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
            logger.error(`Detected ${schemaErrors.length} invalid order's schema.`);
        }

        return orders;
    }
}