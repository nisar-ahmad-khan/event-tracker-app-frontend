import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  CheckCircleIcon, 
  ArrowLeftIcon 
} from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// --- 3D Scene ---
const Scene = () => (
  <mesh>
    <Float speed={2} rotationIntensity={1} floatIntensity={1}>
      <Sphere args={[1, 100, 200]} scale={2.2}>
        <MeshDistortMaterial color="#4F46E5" attach="material" distort={0.5} speed={2} />
      </Sphere>
    </Float>
    <ambientLight intensity={0.5} />
    <pointLight position={[10, 10, 10]} />
  </mesh>
);

const CreateEvent: React.FC = () => {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    type: '',
    revenue: '',
    frequency: '',
    attendance: '',
    ageRange: '',
    audience: '',
    country: 'United States',
    phone: '',
    agreedToTerms: false,
    nextStep: '',
  });

  const questions = [
    { id: 'type', question: 'What types of events do you organize?', options: ['Music', 'Food and drink', 'Community and culture', 'Business', 'Performing and visual art', 'Seasonal', 'More'] },
    { id: 'revenue', question: 'How much revenue do you expect from ticket sales this year?', options: ['Under 10k', '10-50k', '50-250k', '250-1M', '1M+', 'Unsure, but I do sell tickets', 'None, my events are free'] },
    { id: 'frequency', question: 'How many events do you plan to organize in the next 12 months?', options: ['1', '2-5', '6-10', '11-25', '26-50', '51+'] },
    { id: 'attendance', question: 'How many people usually attend your events?', options: ['1-250', '251-1000', '1,001-10,000', '10,001-25,000', '25,001-100,000', '100,001-200,000', '201,000+'] },
    { id: 'ageRange', question: "What's the typical age range of your attendees?", options: ['Under 18', '18-25', '26-35', '36-50', '50+'] },
    { id: 'audience', question: 'How would you describe your primary audience?', options: ['Families', 'Singles', 'Couples', 'Party-goers', 'Music lovers', 'Professionals', 'Students', 'Parents', 'Travelers', 'Foodies', 'Fitness enthusiasts', 'Local community', 'Other'] },
    { id: 'phone_capture', question: 'Can we get your phone number?', options: [] },
    { id: 'nextStep', question: "You're all set! What would you like to do next?", options: ['Talk to Sales for custom pricing', 'Create my first event'] },
  ];

  const handleSelect = (value: string) => {
    setFormData({ ...formData, [questions[step].id]: value });
    if (step < questions.length - 1) {
      setTimeout(() => setStep(step + 1), 300);
    }
  };

  const progress = ((step + 1) / questions.length) * 100;

  if (submitted) {
    return (
      <div className="flex min-h-screen bg-white font-sans text-slate-900">
        <div className="w-full lg:w-1/2 flex flex-col justify-center px-12 md:px-24">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
            <h1 className="text-6xl font-black text-slate-900 mb-6">Thank you!</h1>
            <p className="text-2xl font-bold text-slate-800 mb-10">Our sales team will reach out.</p>
            <div className="flex flex-wrap gap-4">
              <button className="px-8 py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-all">
                Explore the platform
              </button>
              <button className="px-8 py-3 bg-slate-100 text-slate-700 rounded-full font-bold hover:bg-slate-200 transition-all">
                Continue to create an event
              </button>
            </div>
          </motion.div>
        </div>
        <div className="hidden lg:flex w-1/2 p-8 items-center justify-center">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }}
            className="w-full h-full max-w-2xl bg-gradient-to-br from-orange-400 to-orange-600 rounded-[2.5rem] shadow-2xl flex items-center justify-center"
          >
             <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-3xl rotate-12 flex items-center justify-center">
                <div className="w-12 h-2 bg-white rounded-full -rotate-45" />
             </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white font-sans text-slate-900">
      {/* Left Visual Panel */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden p-8">
        <div className="w-full h-full rounded-[2.5rem] overflow-hidden relative shadow-2xl">
          {questions[step].id === 'phone_capture' ? (
            <img 
              src="https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80&w=1000" 
              className="absolute inset-0 w-full h-full object-cover animate-in fade-in duration-700"
              alt="Party"
            />
          ) : (
            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center">
              <div className="absolute inset-0 opacity-40"><Canvas><Scene /></Canvas></div>
              <div className="relative z-10 text-center p-12">
                <h2 className="text-4xl font-bold text-white italic">"The best way to predict the future is to create it."</h2>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="w-full lg:w-1/2 flex flex-col">
        {!submitted && <div className="h-1 bg-indigo-600 transition-all duration-500" style={{ width: `${progress}%` }} />}
        
        <div className="flex-1 flex flex-col justify-center px-8 md:px-20 py-12">
          <div className="max-w-xl w-full mx-auto">
            
            <button onClick={() => setStep(Math.max(0, step - 1))} className={`mb-8 p-2 bg-slate-100 rounded-full hover:bg-indigo-100 transition-colors ${step === 0 ? 'invisible' : ''}`}>
              <ArrowLeftIcon className="h-5 w-5 text-slate-600" />
            </button>

            <h1 className="text-4xl font-extrabold text-slate-900 mb-6 tracking-tight">
              {questions[step].question}
            </h1>

            {questions[step].id === 'phone_capture' ? (
              <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
                <p className="text-slate-500 text-lg">
                  Based on your responses, you may be eligible for special offers. Think custom plans, waived fees, personal onboarding, and dedicated advisors. (We won't annoy you! 😉)
                </p>

                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Country *</label>
                    <select className="w-full mt-1 border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none">
                      <option>United States</option>
                      <option>Canada</option>
                    </select>
                  </div>
                  <div className="flex-[2]">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">Phone number *</label>
                    <input 
                      type="tel" 
                      placeholder="Phone number"
                      className="w-full mt-1 border border-slate-300 rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 outline-none"
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <input 
                    type="checkbox" 
                    className="mt-1 h-5 w-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600"
                    onChange={(e) => setFormData({...formData, agreedToTerms: e.target.checked})}
                  />
                  <p className="text-sm text-slate-500 leading-relaxed">
                    I agree that Eventbrite and its service providers can use automated or nonautomated means to call or text me at this number to support my events and share marketing content. I also agree to the <span className="text-indigo-600 underline cursor-pointer">SMS Terms of Service</span>. Consent is not required. Message and data rates may apply.
                  </p>
                </div>

                <div className="flex gap-4 pt-4">
                  <button onClick={() => setStep(step + 1)} className="flex-1 py-4 font-bold border-2 border-slate-200 rounded-xl hover:bg-slate-50 transition-all">Skip</button>
                  <button 
                    disabled={!formData.phone || !formData.agreedToTerms}
                    onClick={() => setStep(step + 1)} 
                    className="flex-1 py-4 font-bold bg-[#F0B1A8] text-white rounded-xl hover:opacity-90 disabled:opacity-50 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {questions[step].options.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelect(option)}
                    className={`group text-left p-5 rounded-2xl border-2 transition-all flex justify-between items-center ${
                      formData[questions[step].id as keyof typeof formData] === option
                        ? 'border-indigo-600 bg-indigo-50 shadow-sm'
                        : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                    }`}
                  >
                    <span className="font-bold text-slate-700">{option}</span>
                    {formData[questions[step].id as keyof typeof formData] === option && <CheckCircleIcon className="h-6 w-6 text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}

            {step === questions.length - 1 && formData.nextStep && (
              <button
                className="mt-12 w-full bg-indigo-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-indigo-700 shadow-xl shadow-indigo-100 transition-all flex items-center justify-center gap-2"
                onClick={() => setSubmitted(true)}
              >
                Complete Setup
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;