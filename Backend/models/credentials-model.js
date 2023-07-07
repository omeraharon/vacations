const Joi = require("joi");

class CredentialsModel {
    constructor(user) {
        this.username = user.username;
        this.password = user.password;
    }

    static #postValidationSchema = Joi.object({
        username: Joi.string().required().min(2).max(100),
        password: Joi.string().required().min(2).max(100),
    });

    ValidatePost() {
        const result = CredentialsModel.#postValidationSchema.validate(this, {abortEarly: false});
        return result.error ? result.error.message : null;
    }
}

module.exports = CredentialsModel;