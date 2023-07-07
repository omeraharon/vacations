const bcrypt = require("bcryptjs");

async function hash(plainText) {
    if(!plainText) return null;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(plainText, salt);
    return hashedPassword;
}

async function compare(password, hash) {
    return await bcrypt.compare(password, hash);
}

module.exports = {
    hash,
    compare
};