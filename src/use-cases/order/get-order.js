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
            productId: order.product_id,
            date: parseDate(order.date),
            price: order.price,
            card: order.card,
            paymentMade: order.payment_made
        });
    }
}