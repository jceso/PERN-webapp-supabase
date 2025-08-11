import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SignUp from './components/SignUp';
import Layout from './Layout';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Events from './components/Events';
import ProtectedRoute from './components/ProtectedRoute';
import EventsManagement from './components/EventsManagement';

export const router = createBrowserRouter([
  {
    element: <ProtectedRoute><Layout /></ProtectedRoute>, // Layout con TopBar
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/app", element: <App /> },
      { path: "/events", element: <Events />},
      { path: "/events-staff", element: <EventsManagement /> },
    ],
  },
  { path: "/signup", element: <SignUp /> },
  { path: "/login", element: <Login /> },
]);