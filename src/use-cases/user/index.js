const makeAddUser = require("./add-user");
const makeAuthUser = require("./auth-user");
const makeGetUserByLogin = require("./get-user-by-login");
const makeGetUser = require("./get-user");
const makeListUsers = require("./list-users");
const makeRemoveUser = require("./remove-user");
const makeUpdateUser = require("./update-user");

const { usersDb } = require("../../data-access");

const addUser = makeAddUser({ usersDb });
const authUser = makeAuthUser({ usersDb });
const getUserByLogin = makeGetUserByLogin({ usersDb });
const getUser = makeGetUser({ usersDb });
const listUsers = makeListUsers({ usersDb });
const removeUser = makeRemoveUser({ usersDb });
const updateUser = makeUpdateUser({ usersDb });

module.exports = { addUser, authUser, getUserByLogin, getUser, listUsers, removeUser, updateUser };