const express = require("express");
const usersLogic = require("../business-logic-layer/users-logic");
const errorsHelper = require("../helpers/errors-helper");
const router = express.Router();

router.get("/:uuid", async (req, res) => {
    try {
        const uuid = req.params.uuid;
        const user = await usersLogic.getOneUserAsync(uuid);
        if(!user) return res.status(404).send("User not found.");
        res.json(user);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

module.exports = router;