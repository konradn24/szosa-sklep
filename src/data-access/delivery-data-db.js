module.exports = function makeDeliveryDataDb({ makeQuery }) {
    return Object.freeze({
        findAll,
        findAllByUserId,
        findByOrderId,
        insert,
        removeByOrderId
    });

    async function findAll() {
        return await makeQuery({ sql: "SELECT * FROM delivery_data" });
    }

    async function findAllByUserId({ id }) {
        return await makeQuery({ sql: "SELECT delivery_data.phone, delivery_data.first_name, delivery_data.last_name, delivery_data.street, delivery_data.house, delivery_data.postal, delivery_data.city, delivery_data.order_id FROM delivery_data INNER JOIN orders ON delivery_data.order_id = orders.id WHERE orders.user_id = ?",
            params: [id]    
        });
    }

    async function findByOrderId({ id }) {
        return await makeQuery({ sql: "SELECT * FROM delivery_data WHERE order_id=?", params: [id] });
    }

    async function insert({ deliveryData }) {
        return await makeQuery({ sql: "INSERT INTO delivery_data (phone, first_name, last_name, street, house, apartment, postal, city, order_id) VALUES (?,?,?,?,?,?,?,?,?)",
            params: [deliveryData.phone, deliveryData.firstName, deliveryData.lastName, deliveryData.street, deliveryData.house, deliveryData.apartment, deliveryData.postal, deliveryData.city, deliveryData.orderId]
        });
    }

    async function removeByOrderId({ id }) {
        return await makeQuery({ sql: "DELETE FROM delivery_data WHERE order_id=?", params: [id] });
    }
}