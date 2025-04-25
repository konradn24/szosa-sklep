module.exports = function makeRemoveDeliveryData({ deliveryDataDb }) {
    return async function removeDeliveryData({ orderId }) {
        const result = await deliveryDataDb.removeByOrderId({ id: orderId });
        
        return { "deletedCount": result.rows.affectedRows };
    }
}