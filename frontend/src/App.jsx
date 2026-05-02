import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProjectProvider } from './context/ProjectContext';
import { NotificationProvider } from './context/NotificationContext';
import Layout from './components/Layout';
import PrivateRoute from './components/PrivateRoute';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import CodeWorkspace from './pages/CodeWorkspace';
import ProjectDetails from './pages/ProjectDetails';
import ProjectInfo from './pages/ProjectInfo';
import WorkspaceSelect from './pages/WorkspaceSelect';
import CompletedProjects from './pages/CompletedProjects';
import Messages from './pages/Messages';
import Team from './pages/Team';
import Docs from './pages/Docs';
import Projects from './pages/Projects';
import AOS from 'aos';
import 'aos/dist/aos.css';

import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}

function App() {
  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-out-cubic',
      once: false,
      mirror: true,
    });
  }, []);

  return (
    <Router>
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignInUrl="/dashboard"
        afterSignUpUrl="/dashboard"
        appearance={{
          variables: {
            colorPrimary: '#059669', // Match primary-600
          },
          elements: {
            formButtonPrimary: "bg-primary-600 text-white hover:bg-primary-700 shadow-md",
          }
        }}
      >
        <AuthProvider>
          <NotificationProvider>
            <ProjectProvider>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/docs" element={<Docs />} />

                <Route element={<PrivateRoute />}>
                  <Route element={<Layout><Dashboard /></Layout>} path="/dashboard" />
                  <Route element={<Layout><Projects /></Layout>} path="/projects" />
                  <Route element={<Layout><WorkspaceSelect /></Layout>} path="/workspaces" />
                  <Route element={<CodeWorkspace />} path="/project/:id" />
                  <Route element={<Layout><ProjectInfo /></Layout>} path="/project/:id/details" />
                  <Route element={<Layout><Messages /></Layout>} path="/messages" />
                  <Route element={<Layout><Team /></Layout>} path="/team" />
                </Route>

                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </ProjectProvider>
          </NotificationProvider>
        </AuthProvider>
      </ClerkProvider>
    </Router>
  );
}

export default App;
