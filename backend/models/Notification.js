import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
    user: { type: String, required: true }, // clerkId of the receiver
    type: { type: String, enum: ['invite', 'assignment', 'system', 'message'], required: true },
    sender: { type: String, required: true }, // Name or ID of the sender
    text: { type: String, required: true },
    unread: { type: Boolean, default: true },
    relatedProjectId: { type: String }, // Optional reference to a project
    createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

export default mongoose.model('Notification', NotificationSchema);
