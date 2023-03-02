const joi = require('joi');

//authorization bearer token is required in body as passing it in header is not allowed as per the guideline 
module.exports = {
    createTaskReq: joi.object({
        task: joi.string().required(),
        date: joi.date().required(),
        status: joi.boolean(),
        // token: joi.string().required()
    }).required(),

    readTaskReq: joi.object({
        // filter: joi.object({
        //     task: joi.string(),
        //     date: joi.date(),
        //     status: joi.boolean(),
        // }),
        perPage: joi.number().required(),
        page: joi.number().required(),
        // token: joi.string().required()
    }).required(),

    updateTaskReq: joi.object({
        _id: joi.string().required(),
        task: joi.string(),
        date: joi.date(),
        status: joi.boolean(),
        // token: joi.string().required()
    }).required(),

    deleteTaskReq: joi.object({
        _id: joi.string().required(),
        task: joi.string(),
        date: joi.date(),
        status: joi.boolean(),
        // token: joi.string().required()
    }).required(),

    sortTaskReq: joi.object({
        order: joi.string().valid('asc', 'desc').required(),
        perPage: joi.number().required(),
        page: joi.number().required(),
    }).required()
}