const Task = require('../../data/models/Task');

module.exports = {
    createTask: async (taskData) => {
        try {
            await new Task(taskData).save();
            let task = await Task.findOne(taskData);
            return task;
        } catch (err) {

        }
    },

    readTask: async (filter = {}, page = 1, perPage = 5, order = 0) => {
        try {
            const totalItems = await Task.count();
            var tasks;
            if (order && order != 0) {
                tasks = await Task
                .find({ isDeleted: false })
                .sort({name: order})
                .limit(perPage)
                .skip((perPage * page) - perPage);
            } else {
                tasks = await Task
                .find({ ...filter, isDeleted: false })
                .limit(perPage)
                .skip((perPage * page) - perPage);                
            }

            return { totalItems, tasks };
        } catch (err) {
            throw err;
        }
    },

    updateTask: async (identifierObj, data) => {
        try {
            let res = await Task.findOneAndUpdate({ user: identifierObj.user, _id: identifierObj._id }, {
                $set: data
            }, { returnOriginal: false });
            return res;
        } catch (err) {
            throw err;
        }
    },

    deleteTask: async (filter) => {
        try {
            let res = await Task.deleteOne(filter);
            return res;
        } catch (err) {
            throw err;
        }
    },

    sortTask: async (perPage, page, order = -1) => {
        try {
            const totalItems = await Task.count()
            let tasks = await Task
                .find({ isDeleted: false })
                .sort({name: order})
                .limit(perPage)
                .skip((perPage * page) - perPage);

            return { totalItems, tasks };
        } catch (err) {
            throw err;
        }

    }
}
