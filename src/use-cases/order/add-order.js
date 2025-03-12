const { AppError, errors } = require("../../utils/errors");

module.exports = function makeAddOrder({ ordersDb }) {
    return async function addOrder({ order }) {
        const result = await ordersDb.insert({ order });
        
        if(!result.rows.insertId) {
            throw new AppError(errors.notCreated, "Inserting order failed.", ['Order'], [order], true);
        }
        
        order.id = result.rows.insertId;
        return order;
    }
}