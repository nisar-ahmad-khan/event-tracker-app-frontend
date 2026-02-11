import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { 
  EnvelopeIcon, 
  LockClosedIcon, 
  UserIcon, 
  ArrowRightIcon, 
  EyeIcon, 
  EyeSlashIcon 
} from '@heroicons/react/24/outline';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useProfileStore } from '../stores/store';

// --- 3D Background Scene ---
const Scene = () => (
  <Canvas className="absolute inset-0">
    <ambientLight intensity={0.5} />
    <directionalLight position={[10, 10, 5]} intensity={1} />
    <Float speed={1.4} rotationIntensity={2} floatIntensity={2}>
      <Sphere args={[1, 100, 200]} scale={2.4}>
        <MeshDistortMaterial 
          color="#D1410C" 
          distort={0.4} 
          speed={1.5} 
          roughness={0.2} 
          metalness={0.1}
        />
      </Sphere>
    </Float>
  </Canvas>
);

const Register: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const authStore = useProfileStore();

  const handleRegister = async (payload: {name:string, email:string, password:string}) => {
    setIsLoading(true);
    setError(null);
    try {
      await authStore.register(payload);
      navigate('/profile');
    } catch (err: any) {
      setError(authStore.error || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-white font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* Left Side: 3D Visuals & Branding */}
      <div className="hidden lg:flex w-1/2 relative bg-slate-50 items-center justify-center p-12">
        <Scene />

        {/* Floating Glass Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 p-10 backdrop-blur-xl bg-white/30 border border-white/40 rounded-[3rem] shadow-2xl max-w-sm text-center"
        >
          <div className="bg-orange-600 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-200">
             <UserIcon className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-4">Start your journey.</h2>
          <p className="text-slate-600 font-medium leading-relaxed">
            Join thousands of organizers creating world-class experiences.
          </p>
        </motion.div>
      </div>

      {/* Right Side: Form */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center px-6 md:px-20 py-12">
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-md w-full"
        >
          <div className="mb-10">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-3">
              Create an account
            </h1>
            <p className="text-slate-500 font-medium">
              Already have an account? {' '}
              <a href="/login" className="text-orange-600 hover:text-orange-700 font-bold transition-colors">
                Log in
              </a>
            </p>
            {error && <p className="text-red-500 font-semibold mt-2">{error}</p>}
          </div>

          <form
            className="space-y-6"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister({ name, email, password });
            }}
          >
            {/* Full Name */}
            <div className="group relative">
              <UserIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input
                required
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-semibold text-slate-800"
              />
            </div>

            {/* Email */}
            <div className="group relative">
              <EnvelopeIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input
                required
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-semibold text-slate-800"
              />
            </div>

            {/* Password */}
            <div className="group relative">
              <LockClosedIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400 group-focus-within:text-orange-600 transition-colors" />
              <input
                required
                type={showPassword ? "text" : "password"}
                placeholder="Create Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-4 bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-orange-600 focus:ring-4 focus:ring-orange-50 outline-none transition-all font-semibold text-slate-800"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
              </button>
            </div>

            {/* Submit */}
            <button 
              disabled={isLoading}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-700 shadow-xl shadow-orange-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-70"
            >
              {isLoading ? (
                <div className="w-6 h-6 border-4 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  Get Started 
                  <ArrowRightIcon className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Social Divider */}
          <div className="mt-10 relative text-center">
             <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-100"></div>
             </div>
             <span className="relative bg-white px-4 text-sm font-bold text-slate-400 uppercase tracking-widest">
                Or secure join with
             </span>
          </div>

          {/* Social Buttons */}
          <div className="mt-8 grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
              <img src="/google-color.svg" className="w-5 h-5" alt="Google" />
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 border-2 border-slate-100 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all">
               <img src="/facebook-color.svg" className="w-5 h-5" alt="Facebook" />
               Facebook
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;
