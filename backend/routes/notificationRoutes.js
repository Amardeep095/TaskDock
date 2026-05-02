import express from 'express';
import { requireAuth } from '@clerk/express';
import Notification from '../models/Notification.js';

const router = express.Router();
router.use(requireAuth());

// GET /api/notifications - Get all user notifications
router.get('/', async (req, res) => {
    try {
        const { userId } = req.auth;
        const notifications = await Notification.find({ user: userId }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch notifications' });
    }
});

// PUT /api/notifications/read - Mark all as read
router.put('/read', async (req, res) => {
    try {
        const { userId } = req.auth;
        await Notification.updateMany({ user: userId, unread: true }, { unread: false });
        res.json({ message: 'Marked all as read' });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update notifications' });
    }
});

export default router;
