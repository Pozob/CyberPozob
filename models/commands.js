import mongoose from "mongoose";

const commandsSchema = new mongoose.Schema({
    channel: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    roles: [String],
    reply: [String],
    config: {}
});

export default mongoose.model('command', commandsSchema);