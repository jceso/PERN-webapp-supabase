import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { supabase } from '../supabaseClient';

export default function SignUp() {
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const navigate = useNavigate();

    // Step 1
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Step 2
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [rptPassword, setRptPassword] = useState('');
    const [university, setUniversity] = useState('University of Perugia (UniPg)');
    const [degreeCourse, setDegreeCourse] = useState('');

    // Normalize name and surname
    function capitalizeWords(str) {
        return str.toLowerCase().split(' ').filter(Boolean)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
    }

    // First step of registration
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
            setErrorMsg('This email is already registered!');
            setLoading(false);
            return;
        }

        // Move to step 2
        setStep(2);
        setLoading(false);
    };

    // Create authentication account and user object
    const handleFinalSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        // Password validation
        if (password.length < 8) {
            setErrorMsg('Password must be at least 8 characters');
            setLoading(false);
            return;
        } if (password !== rptPassword) {
            setErrorMsg('Passwords do not match');
            setLoading(false);
            return;
        }
        const formattedFirstName = capitalizeWords(firstName);
        const formattedLastName = capitalizeWords(lastName);
        const formattedCourse = capitalizeWords(degreeCourse);

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
            course: formattedCourse,
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
        alert('Registration completed!');
        setLoading(false);
        navigate('/');
    };

    return (
        <div className='bg-green-950 border-4 border-green-600 rounded-4xl text-white p-7'  style={{ maxWidth: '600px', margin: '0 auto' }}>
            {step === 1 ? (
                <div>
                    <form className='max-w-md m-auto' onSubmit={handleStepOne}>
                        <h2 className='text-4xl font-bold mb-9'>Registration</h2>
                        <div className='flex gap-3 mt-8'>
                            <input className='bg-green-400 border-2 border-green-800 p-3 w-1/2 rounded-lg text-white'
                                type="text"
                                placeholder="First name"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                required
                            />
                            <input className='bg-[#a8e7c4] border-2 border-green-800 p-3 w-1/2 rounded-lg'
                                type="text"
                                placeholder="Last name"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                required
                            />
                        </div>

                        <input className='bg-green-400 border-2 border-green-800 p-3 mt-4 w-full rounded-lg'
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                        <button className='p-3 mt-6 w-full text-green-950 text-xl font-bold' type="submit" disabled={loading}>
                            {loading ? 'Loading...' : 'Continue'}
                        </button>
                    </form>
                    {errorMsg && <p className='bg-red-200 border-2 border-red-800 mt-3 mx-6 p-4 rounded-xl text-bold text-red-500'>{errorMsg}</p>}
                    <p className='mt-6'>Already have an account? <Link to='/login'>Sign in!</Link></p>
                </div>
            ) : (
                <form className='max-w-md m-auto' onSubmit={handleFinalSubmit}>
                    <h2 className='text-4xl font-bold mb-9'>Complete the profile</h2>
                    <PhoneInput className='mt-4 w-full text-black'
                        country={'it'}
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        inputStyle={{
                            width: '100%',
                            height: '100%',
                            fontSize: '1rem',
                            paddingTop: '1rem',
                            paddingBottom: '1rem',
                            borderRadius: '0.375rem',
                            boxSizing: 'border-box'
                        }}
                        inputProps={{
                            required: true,
                            name: 'phone',
                        }}
                    />

                    <div className='flex gap-3 mt-4'>
                        <input className='bg-green-400 border-2 border-green-800 p-3 w-1/2 rounded-lg text-white'
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <input className='bg-green-400 border-2 border-green-800 p-3 w-1/2 rounded-lg text-white'
                            type="password"
                            placeholder="Repeat password"
                            value={rptPassword}
                            onChange={(e) => setRptPassword(e.target.value)}
                            required
                        />
                    </div>

                    <select className='bg-green-400 border-2 border-green-800 p-3 mt-4 w-full rounded-lg'
                      value={university} onChange={(e) => setUniversity(e.target.value)} required>
                        <option value="University of Perugia (UniPg)">University of Perugia (UniPg)</option>
                        <option value="University of Foreigners (UniStraPg)">University of Foreigners (UniStraPg)</option>
                        <option value="Umbra Institute">Umbra Institute</option>
                    </select>

                    <input className='bg-green-400 border-2 border-green-800 p-3 mt-4 w-full rounded-lg'
                        type="text"
                        placeholder="Degree course"
                        value={degreeCourse}
                        onChange={(e) => setDegreeCourse(e.target.value)}
                        required
                    />

                    <button className='p-3 mt-6 w-full text-green-950 font-bold text-xl' type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Registrate'}
                    </button>
                    {errorMsg && <p  className='bg-red-200 border-2 border-red-800 mt-3 mx-6 p-4 rounded-xl text-bold text-red-500'>{errorMsg}</p>}
                </form>
            )}
        </div>
    );
}