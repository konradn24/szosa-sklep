module.exports = function makeOrdersDb({ makeQuery }) {
    return Object.freeze({
        findAll,
        findById,
        insert,
        remove
    });

    async function findAll() {
        return await makeQuery({ sql: "SELECT * FROM orders" });
    }

    async function findById({ id }) {
        return await makeQuery({ sql: "SELECT * FROM orders WHERE id=?", params: [id] });
    }

    async function insert({ order }) {
        return await makeQuery({ sql: "INSERT INTO orders (user_id, products_ids, date, price, card, payment_made, completed) VALUES (?,?,?,?,?,?,?)",
            params: [order.userId, order.productsIds, order.date, order.price, order.card, order.paymentMade, order.completed]
        });
    }

    async function remove({ id }) {
        return await makeQuery({ sql: "DELETE FROM orders WHERE id=?", params: [id] });
    }
}