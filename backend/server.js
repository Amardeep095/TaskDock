import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { clerkMiddleware, requireAuth } from '@clerk/express';
import mongoose from 'mongoose';
import User from './models/User.js';
import { createServer } from 'http';
import { Server } from 'socket.io';
import projectRoutes from './routes/projectRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

dotenv.config();

const getAllowedOrigins = () => {
    const origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"];
    if (process.env.FRONTEND_URL) {
        // Split by comma if multiple URLs, and trim whitespace/trailing slashes
        const envOrigins = process.env.FRONTEND_URL.split(',').map(url => url.trim().replace(/\/$/, ""));
        origins.push(...envOrigins);
    }
    return origins;
};

const allowedOrigins = getAllowedOrigins();
console.log('🌐 Configured Allowed Origins:', allowedOrigins);

const app = express();
const httpServer = createServer(app);

const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Check if origin (normalized) is in allowedOrigins
        const normalizedOrigin = origin.replace(/\/$/, "");
        if (allowedOrigins.includes(normalizedOrigin)) {
            callback(null, true);
        } else {
            console.error(`❌ CORS blocked for origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
};

const io = new Server(httpServer, {
    cors: corsOptions
});

console.log('🚀 Socket.io server initialized');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
if (process.env.MONGODB_URI) {
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('Connected to MongoDB'))
        .catch(err => console.error('Failed to connect to MongoDB:', err));
} else {
    console.warn('WARNING: MONGODB_URI not found in .env');
}

// Add Clerk middleware to parse the auth state on every request
// If the key is missing, it skips validation but doesn't crash the server
app.use(clerkMiddleware());

// Public route that anyone can access
app.get('/api/public', (req, res) => {
    res.json({ message: "This is a public endpoint. Anyone can see it.", version: "1.2.0-socket-debug" });
});

// Protected route that requires a valid Clerk token
// Uses the requireAuth middleware to reject unauthenticated requests
app.get('/api/protected', requireAuth(), (req, res) => {
    // The user's ID is available on the request via req.auth
    const { userId } = req.auth;
    res.json({
        message: "You are successfully authenticated via Clerk on the backend!",
        userId: userId
    });
});

// Use the newly created routes
app.use('/api/projects', projectRoutes);
app.use('/api/notifications', notificationRoutes);

// Sync endpoint: called by the frontend upon login to ensure MongoDB has the user
app.post('/api/users/sync', requireAuth(), async (req, res) => {
    console.log('📥 Received request at /api/users/sync');
    try {
        const { userId } = req.auth; // The secure verified clerkId
        const { email, name, avatar } = req.body;
        console.log('👤 Extracted Clerk userId:', userId);
        console.log('📦 Request body:', req.body);

        if (!name) {
            console.log('⚠️ Missing required fields: name=', name);
            return res.status(400).json({ error: "Missing required user name" });
        }

        console.log('🔄 Attempting to upsert user in MongoDB...');
        // Upsert the user into MongoDB
        const user = await User.findOneAndUpdate(
            { clerkId: userId },
            {
                clerkId: userId,
                email: email || '', // Fallback to empty string instead of null
                name,
                avatar
            },
            { new: true, upsert: true }
        );
        console.log('✅ User successfully upserted:', user);

        res.json({ message: "User synced successfully", user });
    } catch (error) {
        console.error("Error syncing user:", error);
        res.status(500).json({ error: "Failed to sync user data" });
    }
});

// Add the project routes
app.use('/api/projects', requireAuth(), projectRoutes);

// Add a fallback error handler for Clerk
app.use((err, req, res, next) => {
    console.error("🔴 Global Error Handler Caught:", err.message);
    if (err.stack) console.error(err.stack);

    // Check if it's a Clerk Auth error
    if (err.message && err.message.includes('Unauthenticated')) {
        return res.status(401).json({ error: 'Unauthenticated!', details: err.message });
    }

    res.status(500).send('Internal Server Error!');
});

// Socket.io Logic
io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Diagnostic ping
    socket.on('ping-test', () => {
        socket.emit('pong-test', { time: new Date().toISOString() });
    });

    socket.on('join-project', (projectId) => {
        const roomName = `project-${projectId}`;
        socket.join(roomName);
        console.log(`👥 Socket ${socket.id} joined room: ${roomName}`);

        // Confirm join to client (optional but good for debug)
        socket.emit('joined-room', { room: roomName });
    });

    socket.on('send-message', (data) => {
        const { projectId, message } = data;
        const roomName = `project-${projectId}`;

        console.log(`📩 Received message from ${socket.id} for room ${roomName}:`, message.text);

        // Broadcast to everyone in the project room
        io.to(roomName).emit('new-message', { projectId, message });
        console.log(`📣 Broadcasted message to room ${roomName}`);
    });

    socket.on('disconnect', () => {
        console.log('🔌 Client disconnected:', socket.id);
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
