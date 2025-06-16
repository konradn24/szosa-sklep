module.exports = function makeOrdersDb({ makeQuery }) {
    return Object.freeze({
        findAll,
        findById,
        insert,
        update,
        remove
    });

    async function findAll() {
        return await makeQuery({ sql: "SELECT * FROM orders" });
    }

    async function findById({ id }) {
        return await makeQuery({ sql: "SELECT * FROM orders WHERE id=?", params: [id] });
    }

    async function insert({ order }) {
        return await makeQuery({ sql: "INSERT INTO orders (user_id, products_ids, products_amount, date, price, card, payment_made, completed) VALUES (?,?,?,?,?,?,?,?)",
            params: [order.userId, order.productsIds, order.productsAmount, order.date, order.price, order.card, order.paymentMade, order.completed]
        });
    }

    async function update({ order }) {
        return await makeQuery({ sql: "UPDATE orders SET payment_made = ?, completed = ? WHERE id = ?",
            params: [order.paymentMade, order.completed, order.id]
        });
    }

    async function remove({ id }) {
        return await makeQuery({ sql: "DELETE FROM orders WHERE id=?", params: [id] });
    }
}