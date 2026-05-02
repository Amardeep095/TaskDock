# TaskDock

TaskDock is a full-stack project management and team collaboration platform built with the MERN stack. It provides secure authentication, project and task management, real-time team messaging, and project-specific workspaces in a modern web interface.

## Overview

TaskDock is designed to help individuals and teams organize work, track progress, and collaborate more effectively. The application combines project planning, task execution, communication, and workspace management into a single platform.

## Features

- Secure authentication with Clerk
- Create, manage, and organize projects
- Add tasks and subtasks within each project
- Track project completion progress
- Join shared projects using invite tokens
- Real-time chat with Socket.IO
- Project-specific code workspace with Monaco Editor
- Notification support
- Responsive and interactive user interface
- MongoDB-backed persistent data storage

## Tech Stack

### Frontend
- React
- Vite
- React Router
- Clerk
- Framer Motion
- Socket.IO Client
- Monaco Editor
- Tailwind CSS
- Recharts
- Lucide React

### Backend
- Node.js
- Express
- MongoDB
- Mongoose
- Clerk Express Middleware
- Socket.IO
- dotenv
- cors

## Project Structure

```text
TaskDock/
├── backend/
│   ├── models/
│   │   ├── Notification.js
│   │   ├── Project.js
│   │   └── User.js
│   ├── routes/
│   │   ├── notificationRoutes.js
│   │   └── projectRoutes.js
│   ├── server.js
│   ├── package.json
│   └── .env
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   └── utils/
│   ├── package.json
│   └── .env
└── README.md


## Pages

- Landing Page
- Dashboard
- Projects
- Workspace
- Messages
- Team
- Documentation

## Development Notes

- `.env` files are required and are not committed to the repository
- MongoDB Atlas must be correctly configured for database connectivity
- Clerk keys must be valid for authentication to work
- Backend and frontend ports should match the configured environment variables

## Future Improvements

- Role-based access control
- File uploads and attachments
- Improved member and permission management
- Advanced task filtering and search
- Richer notifications and activity feeds
- Better deployment and production configuration
- Workspace execution and sandbox enhancements

## Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push your branch
5. Open a pull request

## License

This project is licensed under the MIT License.

## Author

Built by Amardeep Kumar.

