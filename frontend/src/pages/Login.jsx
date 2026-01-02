import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            await login(identifier, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-50">
            <div className="w-full max-w-sm">
                <div className="bg-white border border-gray-300 rounded-sm p-10 mb-4">
                    <h1 className="text-4xl font-serif text-center mb-8" style={{ fontFamily: '"Instagram Sans", sans-serif' }}>SnapGram</h1>

                    {error && <p className="text-red-500 text-sm text-center mb-4">{error}</p>}

                    <form onSubmit={handleSubmit} className="flex flex-col gap-2">
                        <input
                            type="text"
                            placeholder="Phone number, username, or email"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-xs rounded-sm focus:ring-gray-400 focus:border-gray-400 block w-full p-2.5 outline-none"
                            value={identifier}
                            onChange={(e) => setIdentifier(e.target.value)}
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
                        <button
                            type="submit"
                            className="text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-1.5 focus:outline-none font-bold"
                        >
                            Log in
                        </button>
                    </form>

                    <div className="flex items-center my-4">
                        <div className="flex-1 border-t border-gray-300"></div>
                        <span className="px-4 text-gray-500 text-xs font-semibold">OR</span>
                        <div className="flex-1 border-t border-gray-300"></div>
                    </div>
                    <div className="text-center">
                        <a href="#" className="text-blue-900 font-semibold text-sm">Log in with Facebook</a>
                    </div>
                    <div className="text-center mt-3">
                        <a href="#" className="text-xs text-blue-900">Forgot password?</a>
                    </div>
                </div>

                <div className="bg-white border border-gray-300 rounded-sm p-5 text-center">
                    <p className="text-sm">
                        Don't have an account? <Link to="/signup" className="text-blue-500 font-semibold">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
