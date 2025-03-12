module.exports = function makeUsersDb({ makeQuery }) {
    return Object.freeze({
        findAll,
        findById,
        findByLogin,
        findByCredentials,
        insert,
        update,
        remove
    });

    async function findAll() {
        return await makeQuery({ sql: "SELECT * FROM users" });
    }

    async function findById({ id }) {
        return await makeQuery({ sql: "SELECT * FROM users WHERE id=?", params: [id] });
    }

    async function findByLogin({ login }) {
        return await makeQuery({ sql: "SELECT * FROM users WHERE login=? LIMIT 1", params: [login] });
    }

    async function findByCredentials({ login, password }) {
        return await makeQuery({ sql: "SELECT * FROM users WHERE login=? AND password=? LIMIT 1", params: [login, password] });
    }

    async function insert({ user }) {
        return await makeQuery({ sql: "INSERT INTO users (login, password, name, admin) VALUES (?,?,?,?)",
            params: [user.login, user.password, user.name, user.admin]
        });
    }

    async function update({ user }) {
        return await makeQuery({ sql: "UPDATE users SET password=?, name=?, admin=? WHERE id=?",
            params: [user.password, user.name, user.admin, user.id]
        });
    }

    async function remove({ id }) {
        return await makeQuery({ sql: "DELETE FROM users WHERE id=?", params: [id] });
    }
}