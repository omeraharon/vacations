const Joi = require("joi");

class VacationModel {
    constructor(vacation) {
        this.vacationId = vacation.vacationId;
        this.uuid = vacation.uuid;
        this.description = vacation.description;
        this.destination = vacation.destination;
        this.startDate = vacation.startDate;
        this.endDate = vacation.endDate;
        this.price = vacation.price;
        this.imageName = vacation.imageName;
    }

    static #postValidationSchema = Joi.object({
        vacationId: Joi.forbidden(),
        uuid: Joi.forbidden(),
        description: Joi.string().required().min(5).max(300),
        destination: Joi.string().required().min(2).max(200),
        startDate: Joi.date().iso().required(),
        endDate: Joi.date().iso().greater(Joi.ref('startDate')).required(),
        price: Joi.number().positive().required(),
        imageName: Joi.forbidden()
    });
    static #patchValidationSchema = Joi.object({
        vacationId: Joi.number().required(),
        uuid: Joi.forbidden(),
        description: Joi.string().optional().min(5).max(300),
        destination: Joi.string().optional().min(2).max(200),
        startDate: Joi.date().optional().iso(),
        endDate: Joi.date().optional().iso().greater(Joi.ref('startDate')),
        price: Joi.number().optional().positive(),
        imageName: Joi.string().required()
    });

    ValidatePost() {
        const result = VacationModel.#postValidationSchema.validate(this, {abortEarly: false});
        return result.error ? result.error.message : null;
    }
    ValidatePatch() {
        const result = VacationModel.#patchValidationSchema.validate(this, {abortEarly: false});
        return result.error ? result.error.message : null;
    }
}

module.exports = VacationModel;