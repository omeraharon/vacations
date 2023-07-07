const dal = require("../data-access-layer/dal");
const bcryptHelper = require("../helpers/bcrypt-helper");
const uuid = require("uuid");
const jwtHelper = require("../helpers/jwt-helper");

async function registerAsync(user) {
    user.password = await bcryptHelper.hash(user.password);
    user.uuid = uuid.v4();

    const isExistQuery = `SELECT username FROM Users WHERE username = ?`;
    const checkIfUserExist = await dal.executeAsync(isExistQuery, [user.username]);
    if(checkIfUserExist.length !== 0) return null;

    const sql = `INSERT INTO Users VALUES(DEFAULT, ?, ?, ?, ?, ?, DEFAULT)`;
    const info = await dal.executeAsync(sql, [
        user.uuid, user.firstName, user.lastName, user.username, user.password
    ]);
    delete user.password;
    user.token = jwtHelper.getNewToken(user);
    user.id = info.insertId;
    return user;
}

async function loginAsync(credentials) {
    const isUserExist = await checkUser(credentials);
    if (!isUserExist) return null;

    const sql = `SELECT id, uuid, firstName, lastName, username, isAdmin
            FROM Users 
            WHERE username = ? AND password = ?`;

    const users = await dal.executeAsync(sql, [
        credentials.username, isUserExist.password
    ]);

    if (users.length === 0) return null;
    const user = users[0];
    user.token = jwtHelper.getNewToken(user);

    return user;
}

async function checkUser(credentials) {
    const isExistQuery = `SELECT username, password FROM Users 
    WHERE username = ?`;

    const checkIfUserExist = await dal.executeAsync(isExistQuery, [credentials.username]);
    if (checkIfUserExist.length === 0) return null;

    const userExist = checkIfUserExist[0];

    const comparedPassword = await bcryptHelper.compare(credentials.password, userExist.password);
    if (!comparedPassword) return null;

    return userExist;
}

module.exports = {
    registerAsync,
    loginAsync
}