import mongoose from 'mongoose';

const NotesSchema = new mongoose.Schema({
    userID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', 
        required: true,
    },
    sessionID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Session', 
        required: true,
    },
    description: {
        type: String,
        required: true,
        trim: true,
    },
    dateTime: {
        type: Date,
        default: Date.now, // By default sets the current date and time
    },
}, {
    timestamps: true, // Adds createdAt and updatedAt fields
});

export default mongoose.model('Note', NotesSchema);
