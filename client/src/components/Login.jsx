import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
    const [authUserId, setAuthUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Step 1
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleAuthSignIn = async (e) => {
        e.preventDefault(); // Prevent page reload
        setLoading(true);
        setErrorMsg('');

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        console.log('Signed in user:', data.user);
        // Optionally redirect or update app state
        // e.g., navigate('/dashboard') or setUser(data.user)

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            <form onSubmit={handleAuthSignIn}>
                <h2>Login</h2>
                <input className='p-3 mt-4'
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input className='p-3 mt-4'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className='mt-4' type="submit" disabled={loading}>
                    {loading ? 'Connecting...' : 'Sign in'}
                </button>

                <p>You don't have any account? <Link to='/signup'>Sign up!</Link></p>
                {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
            </form>
        </div>
    );
}