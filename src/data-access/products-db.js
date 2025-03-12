module.exports = function makeProductsDb({ makeQuery }) {
    return Object.freeze({
        findAll,
        findById,
        insert,
        update,
        remove
    });

    async function findAll() {
        return await makeQuery({ sql: "SELECT * FROM products" });
    }

    async function findById({ id }) {
        return await makeQuery({ sql: "SELECT * FROM products WHERE id=?", params: [id] });
    }

    async function insert({ product }) {
        return await makeQuery({ sql: "INSERT INTO products (name, description, image_url, category, price, amount) VALUES (?,?,?,?,?,?)",
            params: [product.name, product.description, product.imageUrl, product.category, product.price, product.amount]
        });
    }

    async function update({ product }) {
        return await makeQuery({ sql: "UPDATE products SET name=?,description=?,image_url=?,category=?,price=?,amount=? WHERE id=?",
            params: [product.name, product.description, product.imageUrl, product.category, product.price, product.amount, product.id]
        });
    }

    async function remove({ id }) {
        return await makeQuery({ sql: "DELETE FROM products WHERE id=?", params: [id] });
    }
}