import { useState } from 'react';
import { Link } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { supabase } from '../supabaseClient';

export default function SignUp() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Step 1
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Step 2
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [university, setUniversity] = useState('');
    const [degreeCourse, setDegreeCourse] = useState('');

    // Normalize name and surname
    function capitalizeWords(str) {
        return str.toLowerCase().split(' ').filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    const handleStepOne = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        // Email validation
        const emailRegex = /\S+@\S+\.\S+/;
        if (!emailRegex.test(email)) {
            setErrorMsg('Invalid email');
            setLoading(false);
            return;
        }
        // Check if email already exists in your "users" table
        const { data: existingUser, error } = await supabase.from('users')
            .select('email').eq('email', email).maybeSingle();
        if (existingUser) {
            setErrorMsg('This email is already registered.');
            setLoading(false);
            return;
        }

        // Move to step 2
        setStep(2);
        setLoading(false);
    };


    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        // Password validation
        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters');
            setLoading(false);
            return;
        }

        const formattedFirstName = capitalizeWords(firstName);
        const formattedLastName = capitalizeWords(lastName);

        // 1. Create the auth user
        const { data, error: signUpError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { display_name: `${formattedFirstName} ${formattedLastName}` }
            }
        });

        if (signUpError) {
            setErrorMsg(signUpError.message);
            setLoading(false);
            return;
        }

        const userId = data.user?.id;
        if (!userId) {
            setErrorMsg('User ID not found');
            setLoading(false);
            return;
        }

        // 2. Insert profile in DB
        const { error: dbError } = await supabase.from('users').insert({
            id: userId,
            first_name: formattedFirstName,
            last_name: formattedLastName,
            email,
            phone_number: `+${phoneNumber}`,
            university,
            course: degreeCourse,
            role: 'student'
        });

        if (dbError) {
            setErrorMsg('Failed to save user profile: ' + dbError.message);
            setLoading(false);
            return;
        }

        alert('Registration completed!');
        setLoading(false);
        // Optional: redirect or clear form
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {step === 1 ? (
                <form onSubmit={handleStepOne}>
                    <h2>Registration (Step 1)</h2>
                    <input
                        type="text"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registrazione...' : 'Continua'}
                    </button>

                    <p>Already have an account? <Link to='/login'>Sign in!</Link></p>
                    {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                </form>
            ) : (
                <form onSubmit={handleFinalSubmit}>
                    <h2>Completamento profilo (Passo 2)</h2>
                    <PhoneInput
                        country={'it'}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        inputStyle={{ width: '100%' }}
                        inputProps={{
                            required: true,
                            name: 'phone',
                        }}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <select value={university} onChange={(e) => setUniversity(e.target.value)} required>
                        <option value="University of Perugia (UniPg)" defaultChecked>University of Perugia (UniPg)</option>
                        <option value="University of Foreigners (UniStraPg)">University of Foreigners (UniStraPg)</option>
                        <option value="Umbra Institute">Umbra Institute</option>
                    </select>

                    <input
                        type="text"
                        placeholder="Degree course"
                        value={degreeCourse}
                        onChange={(e) => setDegreeCourse(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Salvataggio...' : 'Completa registrazione'}
                    </button>
                    {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                </form>
            )}
        </div>
    );
}