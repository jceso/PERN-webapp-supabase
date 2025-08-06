import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

export const router = createBrowserRouter([
    { path: '/', element: (
        <ProtectedRoute>
            <Dashboard />
        </ProtectedRoute> )
    },
    { path: '/signup', element: <SignUp /> },
    { path: '/login', element: <Login /> },
    { path: '/app', element: (
        <ProtectedRoute>
            <App />
        </ProtectedRoute> )
    }
]);