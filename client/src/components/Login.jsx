import { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function Login() {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
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
        <div className="bg-green-950 border-4 border-green-600 rounded-4xl text-white p-7 max-w-[600px] mx-auto">
            <form className='max-w-md m-auto' onSubmit={handleAuthSignIn}>
                <h2 className='text-4xl font-bold mb-9'>Login</h2>
                <input className='bg-green-400 border-2 border-green-800 p-3 w-full rounded-lg'
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />

                <input className='bg-green-400 border-2 border-green-800 p-3 mt-4 w-full rounded-lg'
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                <button className='p-3 mt-6 w-full text-green-950 font-bold text-xl' type="submit" disabled={loading}>
                    {loading ? 'Connecting...' : 'Sign in'}
                </button>

                {errorMsg && <p  className='bg-red-200 border-2 border-red-800 mt-3 mx-6 p-4 rounded-xl text-bold text-red-500'>{errorMsg}</p>}
                <p className='mt-6'>You don't have an account? <Link to='/signup'>Sign up!</Link></p>
            </form>
        </div>
    );
}