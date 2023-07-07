const express = require("express");
const verifyLoggedIn = require("../middleware/verify-logged-in");
const followersLogic = require("../business-logic-layer/followers-logic");
const vacationsLogic = require("../business-logic-layer/vacations-logic");
const errorsHelper = require("../helpers/errors-helper");
const router = express.Router();

router.use(verifyLoggedIn);

router.post("/follow", async (req, res) => { 
    try {
        const {id, vacationId} = req.body;
        if(!id || !vacationId) return res.status(401).send("Missing details to add a vacation follow!")
        const newFollow = await followersLogic.addFollower(id, vacationId);
        if(!newFollow) return res.status(400).send("You are already following this vacation");

        const vacations = await vacationsLogic.getAllVacationsAsync(id);
        res.status(201).json(vacations);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/remove", async (req, res) => { 
    try {
        const {id, vacationId} = req.body;
        if(!id || !vacationId) return res.status(401).send("Missing details to remove a vacation follow!")
        const removingFollow = await followersLogic.removeFollower(id, vacationId);
        if(!removingFollow) return res.status(400).send("You are already not following this vacation");
        
        const vacations = await vacationsLogic.getAllVacationsAsync(id);
        res.status(201).json(vacations);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/status", async (req, res) => { 
    try {
        const {id, vacationId} = req.body;
        if(!id || !vacationId) return res.status(401).send("Missing details to find follow status");
        const isFollow = await followersLogic.getFollowStatus(id, vacationId);
        res.status(201).json({isFollow});
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/followers", async (req, res) => { 
    try {
        const {id, vacationId} = req.body;
        if(!id || !vacationId) return res.status(401).send("Missing details to find followers number");
        const followers = await followersLogic.getFollowersNumber(id, vacationId);
        res.status(201).json(followers);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});


module.exports = router;