const { makeDeliveryData } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");

module.exports = function makeGetDeliveryData({ deliveryDataDb }) {
    return async function getDeliveryData({ orderId }) {
        const result = await deliveryDataDb.findByOrderId({ id: orderId });
        const deliveryData = result.rows[0];

        if(!deliveryData) {
            throw new AppError(errors.notFound, "Delivery data not found.", ['Order ID'], [orderId]);
        }

        return makeDeliveryData({
            orderId: deliveryData.order_id,
            phone: deliveryData.phone,
            firstName: deliveryData.first_name,
            lastName: deliveryData.last_name,
            street: deliveryData.street,
            house: deliveryData.house,
            apartment: deliveryData.apartment,
            postal: deliveryData.postal,
            city: deliveryData.city,
            email: deliveryData.email
        });
    }
}