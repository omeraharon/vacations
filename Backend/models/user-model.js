const Joi = require("joi");

class UserModel {
    constructor(user) {
        this.id = user.id;
        this.uuid = user.uuid;
        this.firstName = user.firstName;
        this.lastName = user.lastName;
        this.username = user.username;
        this.password = user.password;
        this.isAdmin = user.isAdmin;
        this.token = user.token;
    }

    static #postValidationSchema = Joi.object({
        id: Joi.forbidden(),
        uuid: Joi.forbidden(),
        firstName: Joi.string().required().min(2).max(100),
        lastName: Joi.string().required().min(2).max(100),
        username: Joi.string().required().min(2).max(100),
        password: Joi.string().required().min(2).max(100),
        isAdmin: Joi.forbidden(),
        token: Joi.forbidden(),
    });

    ValidatePost() {
        const result = UserModel.#postValidationSchema.validate(this, {abortEarly: false});
        return result.error ? result.error.message : null;
    }
}

module.exports = UserModel;