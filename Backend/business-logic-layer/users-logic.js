const dal = require("../data-access-layer/dal");

async function getOneUserAsync(uuid) {
    const sql = `SELECT uuid, firstName, lastName, username, isAdmin FROM Users WHERE uuid = ?'`;
    
    const users = await dal.executeAsync(sql, [uuid]);
    return users[0];
}

module.exports = {
    getOneUserAsync
};