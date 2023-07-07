const express = require("express");
const fs = require("fs");
const vacationsLogic = require("../business-logic-layer/vacations-logic");
const errorsHelper = require("../helpers/errors-helper");
const verifyAdmin = require("../middleware/verify-admin");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const VacationModel = require("../models/vacation-model");
const path = require("path");
const router = express.Router();

router.get("/", verifyLoggedIn, async (req, res) => { 
    try {
        const {id} = req.headers.userDetails;
        const vacations = await vacationsLogic.getAllVacationsAsync(id);
        res.status(201).json(vacations);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.get("/:uuid", verifyAdmin, async (req, res) => { 
    try {
        const uuid = req.params.uuid;
        const vacation = await vacationsLogic.getOneVacationAsync(uuid);
        res.status(201).json(vacation);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/add", verifyAdmin, async (req, res) => { // add vacation (admin)
    try {
        const vacation = req.body;
        const image = req.files && req.files.image ? req.files.image : null;
        if(!image) return res.status(400).send("Missing image");

        const vacationToAdd = new VacationModel(vacation);
        const errors = vacationToAdd.ValidatePost();
        if(errors) return res.status(400).send(errors);

        const addedVacation = await vacationsLogic.addVacationAsync(vacationToAdd, image);
        res.status(201).json(addedVacation);
    }
    catch(err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.patch("/:uuid", verifyAdmin, async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const vacationToUpdate = new VacationModel(req.body);
        const errors = vacationToUpdate.ValidatePatch();
        if(errors) return res.status(400).send(errors);
        vacationToUpdate.uuid = uuid;
        const image = req.files && req.files.image ? req.files.image : null;
        const updateVacation = await vacationsLogic.updateVacationAsync(vacationToUpdate, image);

        res.status(201).json(updateVacation);
    }
    catch(err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.delete("/:uuid", verifyAdmin, async (req, res) => {
    try {
        const uuid = req.params.uuid;
        await vacationsLogic.deleteVacationAsync(uuid);
        res.sendStatus(204);
    }
    catch(err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.get("/images/:imageName", async (req, res) => {
    try {
        const imageName = req.params.imageName;
        let imageFile = path.join(__dirname, "..", "images", "vacations", imageName);
        if(!fs.existsSync(imageFile)) imageFile = path.join(__dirname, "..", "images", "vacations", "not-found.png");
        res.sendFile(imageFile);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

module.exports = router;