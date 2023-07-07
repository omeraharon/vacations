
const dal = require("../data-access-layer/dal");

async function addFollower(userId, vacationId) {
    const sql = 'INSERT INTO Followers VALUES(?, ?)';
    const follow = await dal.executeAsync(sql, [userId, vacationId]);
    return follow.affectedRows === 0 ? null : follow;
}

async function removeFollower(userId, vacationId) {
    const sql = 'DELETE FROM Followers WHERE userId = ? AND vacationId = ?';
    const removingFollow = await dal.executeAsync(sql, [userId, vacationId]);
    return removingFollow.affectedRows === 0 ? null : removingFollow;
}

async function getFollowStatus(userId, vacationId) {
    const sql = `SELECT * FROM Followers WHERE userId = ? AND vacationId = ?`;
    const follow = await dal.executeAsync(sql, [userId, vacationId]);
    return follow.length === 0 ? false : true;
}

async function getFollowersNumber(userId, vacationId) {
    const sql = `SELECT COUNT(?) AS followersNumber FROM Followers WHERE vacationId = ?`;
    const followers = await dal.executeAsync(sql, [userId, vacationId]);
    return followers[0];
}

module.exports = {
    addFollower,
    removeFollower,
    getFollowStatus,
    getFollowersNumber
}