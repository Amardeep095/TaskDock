import express from 'express';
import { requireAuth } from '@clerk/express';
import Project from '../models/Project.js';
import User from '../models/User.js';

const router = express.Router();

// Middleware to enforce auth on all project routes
router.use(requireAuth());

// GET /api/projects - Get all projects for logged in user
router.get('/', async (req, res) => {
    const { userId } = req.auth;
    console.log(`📥 GET /api/projects request from ${userId}`);
    try {
        // Find the user's ObjectId based on their clerkId
        console.log(`🔍 Finding user record for clerkId: ${userId}`);
        const user = await User.findOne({ clerkId: userId });
        console.log(`👤 Found user: ${user ? user.name : 'Not Found'}`);

        // Find projects where user is creator OR assigned
        console.log(`📂 Fetching projects for ${userId}...`);
        const projects = await Project.find({
            $or: [
                { createdBy: userId },
                { assignedTo: user ? user._id : null }
            ]
        }).populate('assignedTo', 'name email avatar clerkId');

        console.log(`✅ Success! Found ${projects.length} projects.`);
        res.json(projects);
    } catch (error) {
        console.error('❌ Error fetching projects:', error);
        res.status(500).json({
            error: 'Failed to fetch projects',
            details: error.message,
            stack: error.stack
        });
    }
});

// POST /api/projects - Create a new project
router.post('/', async (req, res) => {
    console.log(`🚀 POST /api/projects request from ${req.auth.userId}`);
    console.log('📦 Request body:', JSON.stringify(req.body, null, 2));
    try {
        const { userId } = req.auth;
        const projectData = req.body;

        // Auto-generate a secure token for joining via link
        const generateToken = () => Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

        let uniqueToken = generateToken();
        let isUnique = false;

        // Ensure the token is truly unique in the database
        while (!isUnique) {
            const existing = await Project.findOne({ joinToken: uniqueToken });
            if (!existing) {
                isUnique = true;
            } else {
                uniqueToken = generateToken();
            }
        }

        const newProject = new Project({
            ...projectData,
            createdBy: userId,
            assignedTo: [],
            joinToken: uniqueToken
        });

        console.log(`🚀 Saving new project: ${newProject.name} (ID: ${newProject.id}) with Token: ${uniqueToken}`);
        await newProject.save();
        console.log(`✅ Project saved successfully: ${newProject._id}`);
        res.status(201).json(newProject);
    } catch (error) {
        console.error('❌ Error creating project:', error);
        res.status(500).json({
            error: 'Failed to create project',
            details: error.message,
            stack: error.stack
        });
    }
});

// POST /api/projects/join - Join project via code and password
router.post('/join', async (req, res) => {
    try {
        const { userId } = req.auth;
        const { joinToken } = req.body;

        if (!joinToken) {
            return res.status(400).json({ error: 'An invite link/token is required to join.' });
        }

        const user = await User.findOne({ clerkId: userId });
        if (!user) return res.status(404).json({ error: 'User must be synced first' });

        const project = await Project.findOne({ joinToken: joinToken });
        if (!project) return res.status(404).json({ error: 'Invalid invite link or project not found' });

        // Prevent creator from joining their own assigned list
        if (project.createdBy === userId) {
            return res.json({ success: true, message: 'You own this project, no need to join!', project });
        }

        // Add if not already there
        if (!project.assignedTo.includes(user._id)) {
            project.assignedTo.push(user._id);
            await project.save();
            return res.json({ success: true, message: 'Successfully joined shared project!', project });
        }

        res.json({ success: false, message: 'You are already a member of this project.', project });
    } catch (error) {
        console.error('Error joining project by link:', error);
        res.status(500).json({ error: 'Internal Server Error while joining project' });
    }
});

// DELETE /api/projects/:id - Delete a project
router.delete('/:id', async (req, res) => {
    try {
        const { userId } = req.auth;

        // Find and ensure user is the creator
        const project = await Project.findOne({ id: req.params.id, createdBy: userId });
        if (!project) return res.status(404).json({ error: 'Project not found or unauthorized' });

        await Project.deleteOne({ id: req.params.id });
        res.json({ message: 'Project deleted' });
    } catch (error) {
        console.error('Error deleting project:', error);
        res.status(500).json({ error: 'Failed to delete project' });
    }
});

// POST /api/projects/:id/tasks - Add a task
router.post('/:id/tasks', async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        project.tasks.push(req.body);

        // Recalculate progress
        const completed = project.tasks.filter(t => t.completed).length;
        project.progress = project.tasks.length > 0 ? Math.round((completed / project.tasks.length) * 100) : 0;

        await project.save();
        res.json(project);
    } catch (error) {
        console.error('Error adding task:', error);
        res.status(500).json({ error: 'Failed to add task' });
    }
});

// PUT /api/projects/:id/tasks/:taskId - Toggle task completion
router.put('/:id/tasks/:taskId', async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const task = project.tasks.find(t => t.id === Number(req.params.taskId));
        if (task) {
            task.completed = !task.completed;

            // Recalculate progress
            const completed = project.tasks.filter(t => t.completed).length;
            project.progress = project.tasks.length > 0 ? Math.round((completed / project.tasks.length) * 100) : 0;

            await project.save();
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle task' });
    }
});

// POST /api/projects/:id/tasks/:taskId/subtasks - Add subtask
router.post('/:id/tasks/:taskId/subtasks', async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const task = project.tasks.find(t => t.id === Number(req.params.taskId));
        if (task) {
            task.subtasks.push(req.body);
            await project.save();
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to add subtask' });
    }
});

// PUT /api/projects/:id/tasks/:taskId/subtasks/:subtaskId - Toggle subtask
router.put('/:id/tasks/:taskId/subtasks/:subtaskId', async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        const task = project.tasks.find(t => t.id === Number(req.params.taskId));
        if (task) {
            const subtask = task.subtasks.find(st => st.id === Number(req.params.subtaskId));
            if (subtask) {
                subtask.completed = !subtask.completed;
                await project.save();
            }
        }
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle subtask' });
    }
});

// PUT /api/projects/:id/complete - Mark project and all tasks as complete
router.put('/:id/complete', async (req, res) => {
    try {
        const project = await Project.findOne({ id: req.params.id });
        if (!project) return res.status(404).json({ error: 'Project not found' });

        project.progress = 100;
        project.tasks.forEach(t => {
            t.completed = true;
            t.subtasks.forEach(st => st.completed = true);
        });

        await project.save();
        res.json(project);
    } catch (error) {
        res.status(500).json({ error: 'Failed to complete project' });
    }
});

// POST /api/projects/:id/chat - Add message
router.post('/:id/chat', async (req, res) => {
    try {
        const projectIdString = req.params.id;
        const projectId = Number(projectIdString);

        console.log(`💬 POST /api/projects/${projectIdString}/chat (parsed as ${projectId})`);
        console.log(`📦 Message body:`, JSON.stringify(req.body, null, 2));

        if (isNaN(projectId)) {
            console.log(`❌ Invalid project ID format: ${projectIdString}`);
            return res.status(400).json({ error: 'Invalid project ID format. Expected a number.' });
        }

        const project = await Project.findOne({ id: projectId });
        if (!project) {
            console.log(`❌ Project NOT FOUND for chat addition. Search ID: ${projectId}`);
            // Diagnostic: let's see if we can find it by any other means
            const allProjects = await Project.find({}, 'id name');
            console.log(`🔍 Existing projects in DB:`, allProjects.map(p => `${p.name}(${p.id})`).join(', '));
            return res.status(404).json({ error: 'Project not found' });
        }

        console.log(`✅ Project found: ${project.name} (DB _id: ${project._id})`);

        // Initialize chat if it doesn't exist
        if (!project.chat) {
            console.log(`🛠️ Initializing chat array for ${project.name}`);
            project.chat = [];
        }

        project.chat.push(req.body);
        console.log(`📝 Appending message. New chat length: ${project.chat.length}`);

        const savedProject = await project.save();
        console.log(`💾 Project saved successfully. Final chat count: ${savedProject.chat.length}`);
        res.json(savedProject);
    } catch (error) {
        console.error('❌ Error adding chat message:', error);
        res.status(500).json({
            error: 'Failed to add chat message',
            details: error.message,
            stack: error.stack
        });
    }
});

// PUT /api/projects/:id/workspace - Save project code
router.put('/:id/workspace', async (req, res) => {
    console.log(`📡 PUT /api/projects/${req.params.id}/workspace from ${req.auth.userId}`);
    try {
        const { userId } = req.auth;
        const projectIdString = req.params.id;
        const projectId = Number(projectIdString);

        if (isNaN(projectId)) {
            console.log(`❌ Invalid project ID format: ${projectIdString}`);
            return res.status(400).json({ error: 'Invalid project ID format. Expected a number.' });
        }
        console.log(`🔍 Finding project ${projectId} for creator ${userId}`);
        const project = await Project.findOne({ id: projectId, createdBy: userId });

        if (!project) {
            console.log(`⚠️ Project not found as creator, checking shared access for ${projectId}`);
            const assignedProject = await Project.findOne({ id: projectId }).populate('assignedTo');

            if (!assignedProject) {
                console.log(`❌ Project ${projectId} does not exist in database`);
                return res.status(404).json({ error: 'Project not found' });
            }

            const isAssigned = assignedProject.assignedTo.some(u => u.clerkId === userId);

            if (!isAssigned) {
                console.log(`🚫 User ${userId} is not assigned to project ${projectId}`);
                return res.status(404).json({ error: 'Unauthorized workspace access' });
            }

            console.log(`✅ User ${userId} has shared access to ${projectId}`);
            assignedProject.workspace = req.body.workspace;
            await assignedProject.save();
            return res.json(assignedProject);
        }

        console.log(`✅ Found project ${projectId} as creator`);
        project.workspace = req.body.workspace;
        await project.save();
        console.log(`💾 Workspace saved for project ${projectId}`);
        res.json(project);
    } catch (error) {
        console.error('❌ Error saving workspace:', error);
        res.status(500).json({ error: 'Failed to save project code' });
    }
});

export default router;
