const { AppError, errors } = require("../../utils/errors");

module.exports = function makeAddOrder({ ordersDb }) {
    return async function addOrder({ order }) {
        order.productsIds = order.productsIds.join(',');
        order.productsAmount = order.productsAmount.join(',');
        const result = await ordersDb.insert({ order });
        
        if(!result.rows.insertId) {
            throw new AppError(errors.notCreated, "Inserting order failed.", ['Order'], [order], true);
        }
        
        order.id = result.rows.insertId;
        order.productsIds = order.productsIds.split(',').map(Number);
        order.productsAmount = order.productsAmount.split(',').map(Number);
        return order;
    }
}