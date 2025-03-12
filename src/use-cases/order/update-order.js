const { makeOrder } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeUpdateOrder({ ordersDb }) {
    return async function updateOrder({ order }) {
        const result = await ordersDb.update({ order });

        if(result.rows.affectedRows === 0) {
            throw new AppError(errors.notUpdated, "Updating order failed.", ['New order'], [order], true);
        }
        
        const updated = await ordersDb.findById({ id: order.id });
        const updatedOrder = updated.rows[0];

        if(!updatedOrder) {
            throw new AppError(errors.notFound, "Updated order not found.", ['ID'], [id], true);
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