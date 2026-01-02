import { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { motion } from 'framer-motion';

const ModernInput = ({ icon: Icon, type, placeholder, value, onChange, name, isValid, showValidation = false }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [isFocused, setIsFocused] = useState(false);

    const isPassword = type === 'password';
    const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

    return (
        <div className="mb-5 relative group">
            <div
                className={`flex items-center border-b-2 transition-all duration-300 py-2.5
                ${isFocused ? 'border-blue-600' : 'border-gray-200 group-hover:border-gray-300'}
             `}
            >
                {Icon && (
                    <Icon
                        className={`w-5 h-5 mr-3 transition-colors duration-300 
                        ${isFocused ? 'text-blue-600' : 'text-gray-400 group-hover:text-gray-500'}`}
                        strokeWidth={isFocused ? 2.5 : 2}
                    />
                )}

                <input
                    type={inputType}
                    name={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                    className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-400 text-sm font-medium transition-colors"
                />

                {/* Validation Check */}
                {showValidation && isValid && (
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="bg-green-100 rounded-full p-0.5 ml-2"
                    >
                        <Check className="w-3 h-3 text-green-500" strokeWidth={3} />
                    </motion.div>
                )}

                {/* Password Toggle */}
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="ml-2 text-gray-400 hover:text-blue-600 focus:outline-none transition-colors duration-200"
                    >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                )}
            </div>

            {/* Subtle animated underline effect for extra polish */}
            {isFocused && (
                <motion.div
                    layoutId="input-underline"
                    className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600/20 blur-[2px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}
        </div>
    );
};

export default ModernInput;
