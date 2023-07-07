const dal = require("../data-access-layer/dal");
const path = require("path");
const { safeDelete } = require("../helpers/files-helper");
const uuid = require("uuid");

async function getAllVacationsAsync(userId) {

    const sql = `SELECT Vacations.*, COUNT(followers.vacationId) AS followersCount
    FROM Vacations LEFT JOIN followers on Vacations.vacationId = followers.vacationId 
    GROUP BY Vacations.vacationId ORDER BY followersCount DESC`;

    const vacations = await dal.executeAsync(sql, [userId]);
    return vacations;
}

async function getOneVacationAsync(uuid) {
    const sql = `SELECT * FROM Vacations WHERE uuid = ?`;
    
    const vacation = await dal.executeAsync(sql, [uuid]);
    return vacation[0];
}

async function addVacationAsync(vacation, image) {

    vacation.uuid = uuid.v4();
    vacation.imageName = image.name;

    const sql = `INSERT INTO Vacations(vacationId, uuid, description, destination, startDate, endDate, price, imageName)
    VALUES(DEFAULT, ?, ?, ?, ?, ?, ?, ?)`;

    const info = await dal.executeAsync(sql, [
        vacation.uuid, vacation.description, vacation.destination, vacation.startDate, vacation.endDate, vacation.price, vacation.imageName
    ]);
    vacation.vacationId = info.insertId;
    // add image to folder
    const absolutePath = path.join(__dirname, "..", "images", "vacations", vacation.imageName);
    await image.mv(absolutePath);

    return vacation;
}

async function updateVacationAsync(vacation, image) {
    if(image) {
        const previousPath = path.join(__dirname, "..", "images", "vacations", vacation.imageName);
        safeDelete(previousPath);

        vacation.imageName = image.name;
        const absolutePath = path.join(__dirname, "..", "images", "vacations", image.name);
        await image.mv(absolutePath);
    }

    const sql = `UPDATE Vacations SET description = ?, destination = ?, startDate = ?, endDate = ?, price = ?, imageName = ? WHERE uuid = ?`;
    const info = await dal.executeAsync(sql, [
        vacation.description, vacation.destination, vacation.startDate, vacation.endDate, vacation.price, vacation.imageName, vacation.uuid
    ]);
    return info.affectedRows === 0 ? null : vacation;
}

async function deleteVacationAsync(uuid) {
    // find vacation object to delete his image from directory;
    const getVacationQuery = `SELECT * FROM Vacations WHERE uuid = ?`;
    const existVacation = await dal.executeAsync(getVacationQuery, [uuid]);
    if(existVacation.length === 0) return null;
    const vacationToDelete = existVacation[0];

    const sql = `DELETE FROM Vacations WHERE uuid = ?`; // delete
    await dal.executeAsync(sql, [uuid]);

    const {imageName} = vacationToDelete;
    const absolutePath = path.join(__dirname, "..", "images", "vacations", imageName);
    safeDelete(absolutePath);
}

module.exports = {
    getAllVacationsAsync,
    getOneVacationAsync,
    addVacationAsync,
    updateVacationAsync,
    deleteVacationAsync
};