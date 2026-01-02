import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Lock, ArrowRight } from 'lucide-react';
import ModernInput from '../components/ModernInput';
import AuthLayout from '../Layouts/AuthLayout';

const Login = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            await login(identifier, password);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Login" subtitle="Welcome back!">
            {/* Header Nav (No Arrow) */}
            <div className="absolute top-8 right-8 lg:right-24 z-20">
                <div className="text-sm font-medium text-gray-500">
                    Not a member? <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-bold ml-1">Sign up</Link>
                </div>
            </div>

            <div className="mt-20 w-full max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif" style={{ fontFamily: '"Instagram Sans", sans-serif' }}>Log In</h1>
                <p className="text-gray-500 mb-12">Welcome back to SnapGram!</p>

                {error && <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <ModernInput
                        icon={User}
                        type="text"
                        name="identifier"
                        placeholder="Username or Email"
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                    />

                    <ModernInput
                        icon={Lock}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <div className="flex justify-end mb-8">
                        <Link to="/forgot-password" className="text-sm text-gray-500 hover:text-blue-600 font-medium">Forgot Password?</Link>
                    </div>

                    <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">Or login with</span>
                            <div className="flex gap-2">
                                <a
                                    href="https://www.facebook.com"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center hover:bg-blue-50 hover:border-blue-200 transition-all cursor-pointer"
                                >
                                    <span className="text-blue-600 font-bold">f</span>
                                </a>
                            </div>
                        </div>

                        <button
                            type="submit"
                            className={`flex items-center gap-2 px-8 py-3 rounded-full text-white font-medium transition-all shadow-lg hover:shadow-xl active:scale-95
                                ${loading ? 'bg-blue-400 cursor-wait' : 'bg-blue-600 hover:bg-blue-700'}
                            `}
                        >
                            {loading ? 'Logging In...' : 'Log In'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>
        </AuthLayout>
    );
};

export default Login;
