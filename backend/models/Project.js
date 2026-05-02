import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    text: { type: String, required: true },
    completed: { type: Boolean, default: false },
    subtasks: [{
        id: { type: Number, required: true },
        text: { type: String, required: true },
        completed: { type: Boolean, default: false }
    }]
});

const ChatMessageSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    senderId: { type: String },
    senderName: { type: String },
    senderAvatar: { type: String },
    text: { type: String },
    timestamp: { type: String, required: true },
    // Keep legacy fields as optional for migration
    sender: { type: String },
    content: { type: String },
    role: { type: String },
    isSender: { type: Boolean }
}, { strict: false });

const ProjectSchema = new mongoose.Schema({
    id: { type: Number, required: true }, // Keeping old ID format for frontend compatibility if needed
    name: { type: String, required: true },
    description: { type: String, default: '' },
    deadline: { type: String, default: '' },
    priority: { type: String, enum: ['High', 'Medium', 'Low', ''], default: 'Medium' },
    progress: { type: Number, default: 0 },
    workspaceEnabled: { type: Boolean, default: true },
    createdBy: { type: String, required: true }, // clerkId of the creator
    assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Array of User references
    joinToken: { type: String, unique: true, sparse: true },
    tasks: [TaskSchema],
    chat: [ChatMessageSchema],
    workspace: { type: Object, default: {} }
}, { timestamps: true });

export default mongoose.model('Project', ProjectSchema);
