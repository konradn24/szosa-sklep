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
        return await makeQuery({ sql: "INSERT INTO orders (user_id, product_id, date, price, card, payment_made) VALUES (?,?,?,?,?,?)",
            params: [order.userId, order.productId, order.date, order.price, order.card, order.payment_made]
        });
    }

    async function remove({ id }) {
        return await makeQuery({ sql: "DELETE FROM orders WHERE id=?", params: [id] });
    }
}