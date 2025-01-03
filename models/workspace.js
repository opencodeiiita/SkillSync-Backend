import mongoose from 'mongoose';
const workspaceSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sessionIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Session',
    }
  ],
  notesIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Notes',
    }
  ]
});

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;
