module.exports = function makeVerificationDb({ makeQuery }) {
    return Object.freeze({
        findAll,
        findById,
        findByLogin,
        findByCode,
        insert,
        remove
    });

    async function findAll() {
        return await makeQuery({ sql: "SELECT * FROM verification_codes" });
    }

    async function findById({ id }) {
        return await makeQuery({ sql: "SELECT * FROM verification_codes WHERE id=?", params: [id] });
    }

    async function findByLogin({ login }) {
        return await makeQuery({ sql: "SELECT * FROM verification_codes WHERE login=?", params: [login] });
    }

    async function findByCode({ code }) {
        return await makeQuery({ sql: "SELECT * FROM verification_codes WHERE code=?", params: [code] });
    }

    async function insert({ verification }) {
        return await makeQuery({ sql: "INSERT INTO verification_codes (login, code) VALUES (?,?)",
            params: [verification.login, verification.code]
        });
    }

    async function remove({ id }) {
        return await makeQuery({ sql: "DELETE FROM verification_codes WHERE id=?", params: [id] });
    }
}