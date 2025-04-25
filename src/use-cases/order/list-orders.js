const { makeOrder } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");
const logger = require("../../services/logger");

module.exports = function makeListOrders({ ordersDb, parseDate }) {
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
                    productsIds: result.rows[i].products_ids.split(',').map(Number),
                    date: parseDate(result.rows[i].date),
                    price: result.rows[i].price,
                    card: result.rows[i].card,
                    paymentMade: result.rows[i].payment_made === 0 ? false : true
                }));
            } catch(error) {
                if(error instanceof AppError && error.appCode === errors.schemaError[0]) {
                    console.log(error)
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