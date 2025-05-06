const { makeDeliveryData } = require("../../entities");
const { AppError, errors } = require("../../utils/errors");
const logger = require("../../services/logger");

module.exports = function makeListDeliveriesData({ deliveryDataDb }) {
    return async function listDeliveriesData({ userId } = { userId: null }) {
        const result = userId ? await deliveryDataDb.findAllByUserId({ id: userId }) : await deliveryDataDb.findAll();

        if(result.rows.length === 0) {
            throw new AppError(errors.notFound, "No delivery data found.");
        }

        const deliveriesData = [];
        const schemaErrors = [];
        
        for(var i = 0; i < result.rows.length; i++) {
            try {
                deliveriesData.push(makeDeliveryData({
                    orderId: result.rows[i].order_id,
                    phone: result.rows[i].phone,
                    firstName: result.rows[i].first_name,
                    lastName: result.rows[i].last_name,
                    street: result.rows[i].street,
                    house: result.rows[i].house,
                    apartment: result.rows[i].apartment,
                    postal: result.rows[i].postal,
                    city: result.rows[i].city
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
            logger.error(`Detected ${schemaErrors.length} invalid delivery data's schema.`);
        }

        return deliveriesData;
    }
}