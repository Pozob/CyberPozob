import mongoose from "mongoose";

const channelSchema = new mongoose.Schema({
    _id: {
        type: String
    },
    keySign: {
        type: String,
        default: "!"
    },
    steamId: {
        type: String,
        default: ''
    }
});

export default mongoose.model('channels', channelSchema);