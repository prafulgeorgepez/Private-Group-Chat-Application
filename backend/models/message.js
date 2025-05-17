const mongoose = require('mongoose');
const { Schema } = mongoose;

const MessageSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  room: {
    type: Schema.Types.ObjectId,
    ref: 'Room',
    required: true
  }
}, {timestamps: true});

const Message = mongoose.model('Message', MessageSchema);
module.exports = Message;