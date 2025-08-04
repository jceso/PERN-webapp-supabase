import { createBrowserRouter } from 'react-router-dom';
import App from './App';
import SignUp from './components/SignUp';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

export const router = createBrowserRouter([
    { path: '/', element: <App /> },
    { path: '/signup', element: <SignUp /> },
    { path: '/login', element: <Login /> },
    { path: '/dashboard', element: <Dashboard /> }
])