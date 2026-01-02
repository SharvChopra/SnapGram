import { motion } from "framer-motion";

const AuthLayout = ({ children, title, subtitle, imageSrc }) => {
  return (
    <div className="flex min-h-screen bg-white overflow-hidden">
      {/* Left Side - Form */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full lg:w-1/2 flex flex-col justify-center px-8 lg:px-24 py-12 relative z-10"
      >
        {children}
      </motion.div>

      {/* Right Side - Visuals */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="hidden lg:flex w-1/2 bg-[#4a89f8] relative justify-center items-center overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #4F46E5 0%, #3B82F6 100%)",
          borderRadius: "0 0 0 50px",
        }}
      >
        {/* Abstract Shapes */}
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-black/10 rounded-full blur-3xl"></div>

        {/* Content Card Mockups */}
        <div className="relative z-10 transform rotate-[-5deg]">
          <div className="bg-white/90 p-6 rounded-3xl shadow-2xl w-80 mb-6 backdrop-blur-sm">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-full bg-linear-to-tr from-yellow-400 to-pink-500"></div>
              <div>
                <div className="h-3 w-32 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-2 w-20 bg-gray-100 rounded-full"></div>
              </div>
            </div>
            <div className="h-32 bg-gray-100 rounded-2xl mb-4 w-full"></div>
            <div className="flex gap-2">
              <div className="h-8 w-8 bg-red-50 rounded-full flex items-center justify-center text-red-500">
                ♥
              </div>
              <div className="h-8 w-8 bg-gray-50 rounded-full"></div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-2xl w-80 translate-x-12 backdrop-blur-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800">Your Stats</h3>
              <span className="text-xs text-green-500 bg-green-50 px-2 py-1 rounded-full">
                +12%
              </span>
            </div>
            <div className="flex gap-2 items-end h-24 pb-2">
              <div className="w-1/4 bg-blue-100 h-[60%] rounded-t-lg"></div>
              <div className="w-1/4 bg-blue-200 h-[80%] rounded-t-lg"></div>
              <div className="w-1/4 bg-blue-500 h-full rounded-t-lg"></div>
              <div className="w-1/4 bg-blue-300 h-[50%] rounded-t-lg"></div>
            </div>
          </div>
        </div>

        <div className="absolute top-10 right-10">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center transform rotate-12">
            <span className="text-2xl">📸</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout;
