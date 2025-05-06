const { makeOrder } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");
const { parseDate } = require("../../utils");

module.exports = function makeGetOrder({ ordersDb }) {
    return async function getOrder({ id }) {
        const result = await ordersDb.findById({ id });
        const order = result.rows[0];

        if(!order) {
            throw new AppError(errors.notFound, "Order not found.", ['ID'], [id]);
        }

        return makeOrder({
            id: order.id,
            userId: order.user_id,
            productsIds: order.products_ids.split(',').map(Number),
            date: parseDate(order.date),
            price: order.price,
            card: order.card,
            paymentMade: order.payment_made === 0 ? false : true,
            completed: order.completed === 0 ? false : true
        });
    }
}