const express = require("express");
const authLogic = require("../business-logic-layer/auth-logic");
const errorsHelper = require("../helpers/errors-helper.js");
const UserModel = require("../models/user-model");
const CredentialsModel = require("../models/credentials-model");
const router = express.Router();

router.post("/register", async (req, res) => {
    try {
        const userToAdd = new UserModel(req.body);
        const errors = userToAdd.ValidatePost();
        if(errors) return res.status(400).send(errors);

        const addedUser = await authLogic.registerAsync(userToAdd);
        if(!addedUser) res.status(400).send("Username is already exist");

        res.status(201).json(addedUser);
    }
    catch(err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

router.post("/login", async (req, res) => {
    try {
        const user = new CredentialsModel(req.body);
        const errors = user.ValidatePost();
        if(errors) return res.status(400).send(errors);
        
        const loggedInUser = await authLogic.loginAsync(user);
        if (!loggedInUser) return res.status(401).json("Incorrect username or password.");
        res.status(201).json(loggedInUser);
    }
    catch (err) {
        res.status(500).send(errorsHelper.getError(err));
    }
});

module.exports = router;
