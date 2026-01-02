import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Lock, ArrowRight } from 'lucide-react';
import ModernInput from '../components/ModernInput';
import AuthLayout from '../Layouts/AuthLayout';

const Signup = () => {
    const [formData, setFormData] = useState({
        email: '',
        fullName: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    // Validation Logic
    const validations = {
        length: formData.password.length >= 8,
        number: /\d/.test(formData.password) || /[!@#$%^&*]/.test(formData.password),
        case: /[a-z]/.test(formData.password) && /[A-Z]/.test(formData.password),
        match: formData.password === formData.confirmPassword && formData.password !== ''
    };

    const isFormValid = formData.email && formData.username && validations.length && validations.number && validations.case && validations.match;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!isFormValid) {
            setError('Please verify all fields met the requirements.');
            return;
        }

        setLoading(true);
        try {
            await signup(formData.email, formData.password, formData.username, formData.fullName);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create account');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout>
            {/* Header Nav (No Arrow) */}
            <div className="absolute top-8 right-8 lg:right-24 z-20">
                <div className="text-sm font-medium text-gray-500">
                    Already member? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold ml-1">Sign in</Link>
                </div>
            </div>

            <div className="mt-10 w-full max-w-md mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 mb-2 font-serif" style={{ fontFamily: '"Instagram Sans", sans-serif' }}>Sign Up</h1>
                <p className="text-gray-500 mb-8">Join SnapGram and share your moments.</p>

                {error && <div className="bg-red-50 text-red-500 px-4 py-2 rounded-lg mb-6 text-sm flex items-center gap-2">⚠️ {error}</div>}

                <form onSubmit={handleSubmit}>
                    <ModernInput
                        icon={User}
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={formData.fullName}
                        onChange={handleChange}
                        isValid={formData.fullName.length > 2}
                        showValidation
                    />
                    <ModernInput
                        icon={User}
                        type="text"
                        name="username"
                        placeholder="Username"
                        value={formData.username}
                        onChange={handleChange}
                        isValid={formData.username.length > 2}
                        showValidation
                    />
                    <ModernInput
                        icon={Mail}
                        type="email"
                        name="email"
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={handleChange}
                        isValid={/\S+@\S+\.\S+/.test(formData.email)}
                        showValidation
                    />
                    <ModernInput
                        icon={Lock}
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={formData.password}
                        onChange={handleChange}
                    />

                    {/* Password Strength Indicators */}
                    <div className="mb-6 space-y-2">
                        <div className="flex items-center gap-2 text-xs">
                            <div className={`w-1.5 h-1.5 rounded-full ${validations.length ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={validations.length ? 'text-green-600' : 'text-gray-400'}>At least 8 characters</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className={`w-1.5 h-1.5 rounded-full ${validations.number ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={validations.number ? 'text-green-600' : 'text-gray-400'}>At least one number (0-9) or a symbol</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs">
                            <div className={`w-1.5 h-1.5 rounded-full ${validations.case ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                            <span className={validations.case ? 'text-green-600' : 'text-gray-400'}>Lowercase (a-z) and uppercase (A-Z)</span>
                        </div>
                    </div>

                    <ModernInput
                        icon={Lock}
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-Type Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        isValid={validations.match}
                        showValidation
                    />

                    <div className="flex items-center justify-between mt-8">
                        <div className="flex items-center gap-4">
                            <span className="text-gray-400 text-sm">Or signup with</span>
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
                            {loading ? 'Creating...' : 'Sign Up'}
                            {!loading && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>

                </form>
            </div>
        </AuthLayout>
    );
};

export default Signup;
