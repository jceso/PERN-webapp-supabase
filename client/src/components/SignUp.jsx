import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function SignUp() {
    const [step, setStep] = useState(1);
    const [authUserId, setAuthUserId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');

    // Step 1
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');

    // Step 2
    const [phonePrefix, setPhonePrefix] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [university, setUniversity] = useState('');
    const [degreeCourse, setDegreeCourse] = useState('');

    const handleAuthSignUp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const { data, error } = await supabase.auth.signUp({ email, password });

        if (error) {
            setErrorMsg(error.message);
            setLoading(false);
            return;
        }

        const userId = data.user?.id;
        if (!userId) {
            setErrorMsg('User ID non disponibile');
            setLoading(false);
            return;
        }

        setAuthUserId(userId);
        setStep(2);
        setLoading(false);
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrorMsg('');

        const { error } = await supabase.from('users').insert({
            id: authUserId,
            first_name: firstName,
            last_name: lastName,
            email,
            phone_prefix: phonePrefix,
            phone_number: phoneNumber, // fixed typo: phone_nomber → phone_number
            university,
            degree_course: degreeCourse,
            role: 'student',
        });

        if (error) {
            setErrorMsg(error.message);
        } else {
            alert('Registrazione completata!');
            // Optionally redirect here
        }

        setLoading(false);
    };

    return (
        <div style={{ maxWidth: '400px', margin: '0 auto' }}>
            {step === 1 ? (
                <form onSubmit={handleAuthSignUp}>
                    <h2>Registrazione (Passo 1)</h2>
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

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />

                    <button type="submit" disabled={loading}>
                        {loading ? 'Registrazione...' : 'Continua'}
                    </button>
                    {errorMsg && <p style={{ color: 'red' }}>{errorMsg}</p>}
                </form>
            ) : (
                <form onSubmit={handleProfileSubmit}>
                    <h2>Completamento profilo (Passo 2)</h2>
                    <input
                        type="text"
                        placeholder="Prefix (+39)"
                        value={phonePrefix}
                        onChange={(e) => setPhonePrefix(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="Phone number"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        required
                    />

                    <input
                        type="text"
                        placeholder="University of Perugia"
                        value={university}
                        onChange={(e) => setUniversity(e.target.value)}
                        required
                    />

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