const { ObjectId } = require('mongodb');
const taskRepo = require('../../db_services/task_repo');
const handleErrors = require('../../utilities/controllers/handle_errors');
const joiModel = require('./joi_models');

module.exports = {
    create: async (req, res) => {
        try {
            const validation = joiModel.createTaskReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }

            validatedReq = validation.value
            delete validatedReq.token;

            const createTask = await taskRepo.createTask({ ...validatedReq, user: req.user._id });
            if (!createTask) throw new Error('error in db create task');

            return res.status(200).send({
                message: "task created successfully!",
                success: true,
                data: createTask
            });

        } catch (err) {
            return handleErrors(err, res);
        }
    },

    read: async (req, res) => {
        try {
            const validation = joiModel.readTaskReq.validate(req.query)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }

            validatedReq = validation.value
            const { perPage, page } = validatedReq;
            let order = global[`${req.user.email}_order`] ? global[`${req.user.email}_order`] : 0;
            const {totalItems, tasks} = await taskRepo.readTask({}, page, perPage, order);
            if (!tasks) throw new Error('error in db read tasks');

            return res.status(200).send({
                message: "tasks read successfully!",
                success: true,
                data: {
                    tasks,
                    totalItems,
                    perPage,
                    page
                }
            });
        } catch (err) {
            return handleErrors(err, res);
        }
    },

    update: async (req, res) => {
        try {
            const validation = joiModel.updateTaskReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }

            validatedReq = validation.value
            const task_id = validatedReq._id;
            delete validatedReq._id;
            const updateTask = await taskRepo.updateTask({
                user: new ObjectId(req.user._id),
                _id: new ObjectId(task_id)
            }, validatedReq);
            if (!updateTask) throw new Error('error in db update tasks');

            return res.status(200).send({
                message: "task updated successfully!",
                success: true,
                data: updateTask
            });

        } catch (err) {
            return handleErrors(err, res);
        }
    },

    delete: async (req, res) => {
        try {
            const validation = joiModel.deleteTaskReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }

            validatedReq = validation.value
            const deleteTask = await taskRepo.deleteTask({
                user: req.user._id,
                _id: validatedReq._id
            });
            if (!deleteTask) throw new Error('error in db delete tasks');

            return res.status(200).send({
                message: "task deleted successfully!",
                success: true,
                data: {...deleteTask, ...validatedReq}
            });
        } catch (err) {
            return handleErrors(err, res);
        }
    },

    sort: async (req, res) => {
        try {
            const validation = joiModel.sortTaskReq.validate(req.body)
            if (validation.error) {
                return res.status(200).send({
                    message: validation.error.message ?? "something went wrong",
                    success: false,
                    data: {}
                })
            }

            validatedReq = validation.value
            let {perPage, page} = validatedReq;
            let order = validatedReq.order === 'asc' ? 1 : -1;
            global[`${req.user.email}_order`] = order
            const {totalItems, tasks} = await taskRepo.sortTask(perPage, page, order);
            if (!tasks) throw new Error('error in db sort tasks');

            return res.status(200).send({
                message: "task sorted successfully!",
                success: true,
                data: {totalItems, tasks, perPage, page}
            });
        } catch (err) {
            return handleErrors(err, res);
        }
    }
}