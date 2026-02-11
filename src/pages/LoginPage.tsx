import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, TorusKnot } from '@react-three/drei';
import { EnvelopeIcon, LockClosedIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useProfileStore } from '../stores/store';

// --- Sophisticated 3D Visual for Login ---
const LoginScene = () => (
  <mesh>
    <Float speed={1.5} rotationIntensity={1.5} floatIntensity={2}>
      <TorusKnot args={[1, 0.3, 128, 16]} scale={1.8}>
        <MeshWobbleMaterial 
          color="#D1410C" 
          factor={0.4} 
          speed={1} 
          roughness={0.1} 
          metalness={0.8}
        />
      </TorusKnot>
    </Float>
    <ambientLight intensity={0.6} />
    <pointLight position={[10, 10, 10]} intensity={1.5} />
    <spotLight position={[-10, -10, -10]} angle={0.15} penumbra={1} />
  </mesh>
);

const LoginPage: React.FC = () => {

  interface Logincredential {
    email:string,
    password:string
  }
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

 const login = useProfileStore(state=> state.login);



  const handleLogin = async( data: Logincredential) => {
    // e.preventDefault();

    try{
      await login(data);

    navigate('/')
    }catch(err){
      alert(err)
    }
    



    // const response = await axios.post('http://event-tracker.test/api/login',{
    //   email : email,
    //   password: password
    // });
    // if(response.data.success){
    //   localStorage.setItem('user',JSON.stringify(response.data.data)) 
    //   navigate('/')
    // }
    // console.log("Logging in with:", { email, password });
  };

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans text-slate-900">
      
      {/* LEFT SIDE: Subtle 3D Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-50 relative items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
         
        </div>
        <div className="relative z-10 text-center">
          <h2 className="text-4xl font-bold text-slate-200">Welcome Back.</h2>
          <p className="text-slate-500 mt-2 font-medium">Log in to manage your events and tickets.</p>
        </div>
      </div>

      {/* RIGHT SIDE: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-24 py-12">
        <div className="max-w-md w-full mx-auto">
          
          {/* Logo */}
          <div className="mb-12">
            <span className="text-3xl font-black text-[#D1410C] tracking-tighter">eventbrite</span>
          </div>

          <h1 className="text-4xl font-bold mb-8 tracking-tight">Log in</h1>

          <form onSubmit={(e)=>{
            e.preventDefault()
            handleLogin({email,password})
          }}  className="space-y-6">
            {/* Email Input */}
            <div className="relative group">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-[#D1410C]">
                Email Address
              </label>
              <div className="mt-1 relative">
                <EnvelopeIcon className="h-5 w-5 text-slate-400 absolute left-0 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-b border-slate-200 focus:border-[#D1410C] outline-none transition-all placeholder:text-slate-300"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="relative group">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-500 transition-colors group-focus-within:text-[#D1410C]">
                  Password
                </label>
                <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">Forgot password?</a>
              </div>
              <div className="mt-1 relative">
                <LockClosedIcon className="h-5 w-5 text-slate-400 absolute left-0 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-8 pr-4 py-3 border-b border-slate-200 focus:border-[#D1410C] outline-none transition-all placeholder:text-slate-300"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#D1410C] hover:bg-[#b0360a] text-white font-bold py-4 rounded-sm transition-all flex items-center justify-center gap-3 shadow-lg shadow-orange-100"
            >
              Log in
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </form>

          {/* Social Logins & Divider */}
          <div className="mt-10">
  

           

            <p className="text-center text-sm text-slate-600 mt-10">
              Don't have an account?{' '}
              <a href="/register" className="text-blue-600 font-bold hover:underline transition-all">Sign up</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;