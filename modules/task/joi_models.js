const joi = require('joi');


module.exports = {
    createTaskReq: joi.object({
        task: joi.string().required(),
        date: joi.date().required(),
        status: joi.boolean(),
    }).required(),

    readTaskReq: joi.object({
        perPage: joi.number().required(),
        page: joi.number().required(),
    }).required(),

    updateTaskReq: joi.object({
        _id: joi.string().required(),
        task: joi.string(),
        date: joi.date(),
        status: joi.boolean(),
    }).required(),

    deleteTaskReq: joi.object({
        _id: joi.string().required(),
        task: joi.string(),
        date: joi.date(),
        status: joi.boolean(),
    }).required(),

    sortTaskReq: joi.object({
        order: joi.string().valid('asc', 'desc').required(),
        perPage: joi.number().required(),
        page: joi.number().required(),
    }).required()
}