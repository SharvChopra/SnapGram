import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await signup(username, email, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm">
                <div className="bg-white border border-gray-300 rounded-sm p-10 mb-4">
                    <h1 className="text-4xl font-serif text-center mb-4">SnapGram</h1>
                    <p className="text-center text-gray-500 font-semibold mb-6">Sign up to see photos and videos from your friends.</p>

                    <button className="w-full bg-blue-500 text-white font-bold py-1.5 rounded-lg text-sm mb-4">Log in with Facebook</button>

                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-xs font-semibold">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <input
                            type="email"
                            placeholder="Email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <input
                            type="text"
                            placeholder="Username"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none mb-2"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <p className="text-xs text-gray-500 text-center my-3">
                            By signing up, you agree to our Terms, Privacy Policy and Cookies Policy.
                        </p>
                        <button
                            type="submit"
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none font-bold"
                        >
                            Sign up
                        </button>
                    </form>
                </div>

                <div className="bg-white border border-gray-300 rounded-sm p-5 text-center">
                    <p className="text-sm">
                        Have an account? <Link to="/login" className="text-blue-500 font-semibold">Log in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
