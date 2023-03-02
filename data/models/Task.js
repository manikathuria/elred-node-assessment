const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TaskSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    task: {
        type: String,
        require: true,
    },
    date: {
        type: Date,
        default: Date.now()
    },
    status: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true
});
TaskSchema.index({name: 1});
TaskSchema.index({name: -1});
const Task = mongoose.model("task", TaskSchema);
module.exports =  Task
