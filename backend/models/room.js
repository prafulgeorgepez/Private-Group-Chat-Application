const mongoose = require('mongoose');
const {Schema} = mongoose;

const RoomSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 50,
        unique: true,
    },
    creator: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
}, {timestamps: true});

const Room = mongoose.model('Room', RoomSchema);
module.exports = Room;