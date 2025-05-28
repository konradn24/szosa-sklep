const { makeOrder } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeUpdateOrder({ ordersDb }) {
    return async function updateOrder({ order }) {
        order.productsIds = order.productsIds.join(',');
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
            id: updatedOrder.id,
            userId: updatedOrder.user_id,
            productId: updatedOrder.products_ids.split(',').map(Number),
            productsAmount: updatedOrder.products_amount.split(',').map(Number),
            date: parseDate(updatedOrder.date),
            price: updatedOrder.price,
            card: updatedOrder.card,
            paymentMade: updatedOrder.payment_made === 0 ? false : true,
            completed: updatedOrder.completed === 0 ? false : true
        });
    }
}