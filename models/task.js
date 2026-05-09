import mongoose from 'mongoose'; // Use import instead of require

const taskSchema = new mongoose.Schema({
    title:     { type: String, required: true, trim: true },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

export default Task; // Use export default instead of module.exports